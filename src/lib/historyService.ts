import { prisma } from '@/lib/prisma'
import { StockHistory, CreateHistoryEntry, HistoryAction } from '@/types/history'
import { StockItem } from '@/types/stock'

export class HistoryService {
  // Create a history entry
  static async createEntry(entry: CreateHistoryEntry): Promise<void> {
    await prisma.stockHistory.create({
      data: {
        stockItemId: entry.stockItemId,
        action: entry.action,
        oldValues: entry.oldValues ? JSON.stringify(entry.oldValues) : null,
        newValues: entry.newValues ? JSON.stringify(entry.newValues) : null,
        quantityChange: entry.quantityChange,
        reason: entry.reason
      }
    })
  }

  // Log item creation
  static async logCreate(item: StockItem): Promise<void> {
    await this.createEntry({
      stockItemId: item.id,
      action: 'CREATE',
      newValues: {
        location: item.location,
        name: item.name,
        serialNumber: item.serialNumber,
        quantity: item.quantity,
        projectName: item.projectName,
        projectNumber: item.projectNumber
      },
      quantityChange: item.quantity,
      reason: `Yeni ürün eklendi: ${item.name}`
    })
  }

  // Log item update
  static async logUpdate(oldItem: StockItem, newItem: StockItem): Promise<void> {
    const quantityChange = newItem.quantity - oldItem.quantity
    
    await this.createEntry({
      stockItemId: newItem.id,
      action: quantityChange !== 0 ? 'QUANTITY_CHANGE' : 'UPDATE',
      oldValues: {
        location: oldItem.location,
        name: oldItem.name,
        serialNumber: oldItem.serialNumber,
        quantity: oldItem.quantity,
        projectName: oldItem.projectName,
        projectNumber: oldItem.projectNumber
      },
      newValues: {
        location: newItem.location,
        name: newItem.name,
        serialNumber: newItem.serialNumber,
        quantity: newItem.quantity,
        projectName: newItem.projectName,
        projectNumber: newItem.projectNumber
      },
      quantityChange: quantityChange !== 0 ? quantityChange : undefined,
      reason: quantityChange !== 0 
        ? `Miktar değişikliği: ${quantityChange > 0 ? '+' : ''}${quantityChange}`
        : `Ürün bilgileri güncellendi: ${newItem.name}`
    })
  }

  // Log item deletion
  static async logDelete(item: StockItem): Promise<void> {
    await this.createEntry({
      stockItemId: item.id,
      action: 'DELETE',
      oldValues: {
        location: item.location,
        name: item.name,
        serialNumber: item.serialNumber,
        quantity: item.quantity,
        projectName: item.projectName,
        projectNumber: item.projectNumber
      },
      quantityChange: -item.quantity,
      reason: `Ürün silindi: ${item.name}`
    })
  }

  // Get all history entries with filters
  static async getHistory(filters?: {
    action?: HistoryAction
    startDate?: Date
    endDate?: Date
    stockItemId?: string
    limit?: number
  }): Promise<StockHistory[]> {
    const where: any = {}

    if (filters?.action) {
      where.action = filters.action
    }

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {}
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate
      }
    }

    if (filters?.stockItemId) {
      where.stockItemId = filters.stockItemId
    }

    const entries = await prisma.stockHistory.findMany({
      where,
      include: {
        stockItem: {
          select: {
            name: true,
            location: true,
            serialNumber: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: filters?.limit || 100
    })

    return entries.map(entry => ({
      ...entry,
      oldValues: entry.oldValues ? entry.oldValues : undefined,
      newValues: entry.newValues ? entry.newValues : undefined
    })) as StockHistory[]
  }

  // Get history for a specific item
  static async getItemHistory(stockItemId: string): Promise<StockHistory[]> {
    return this.getHistory({ stockItemId })
  }

  // Get quantity change summary for a date range
  static async getQuantityChangeSummary(startDate: Date, endDate: Date): Promise<{
    totalAdded: number
    totalRemoved: number
    netChange: number
    changesByLocation: Record<string, number>
  }> {
    const entries = await this.getHistory({
      startDate,
      endDate,
      action: 'QUANTITY_CHANGE'
    })

    let totalAdded = 0
    let totalRemoved = 0
    const changesByLocation: Record<string, number> = {}

    for (const entry of entries) {
      const change = entry.quantityChange || 0
      const location = entry.stockItem?.location || 'Unknown'

      if (change > 0) {
        totalAdded += change
      } else {
        totalRemoved += Math.abs(change)
      }

      changesByLocation[location] = (changesByLocation[location] || 0) + change
    }

    return {
      totalAdded,
      totalRemoved,
      netChange: totalAdded - totalRemoved,
      changesByLocation
    }
  }
}