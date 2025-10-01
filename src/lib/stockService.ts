import { StockItem, CreateStockItem, UpdateStockItem } from '@/types/stock'

const API_BASE = '/api/stock'

export class StockService {
  static async getAllItems(): Promise<StockItem[]> {
    const response = await fetch(API_BASE)
    if (!response.ok) {
      throw new Error('Failed to fetch stock items')
    }
    return response.json()
  }

  static async createItem(item: CreateStockItem): Promise<StockItem> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    })
    
    if (!response.ok) {
      throw new Error('Failed to create stock item')
    }
    
    return response.json()
  }

  static async updateItem(item: UpdateStockItem): Promise<StockItem> {
    const response = await fetch(`${API_BASE}/${item.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    })
    
    if (!response.ok) {
      throw new Error('Failed to update stock item')
    }
    
    return response.json()
  }

  static async deleteItem(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete stock item')
    }
  }

  static async exportData(): Promise<StockItem[]> {
    return this.getAllItems()
  }

  static async importData(items: StockItem[]): Promise<void> {
    // Create items one by one (you could batch this in a real app)
    for (const item of items) {
      const { id, createdAt, updatedAt, ...createData } = item
      await this.createItem({
        ...createData,
        deliveryTime: typeof item.deliveryTime === 'string' ? item.deliveryTime : item.deliveryTime.toISOString(),
        image: item.image || undefined
      })
    }
  }
}