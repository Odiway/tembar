export interface StockHistory {
  id: string
  stockItemId: string
  action: HistoryAction
  oldValues?: string
  newValues?: string
  quantityChange?: number
  reason?: string
  createdAt: Date
  stockItem?: {
    name: string
    location: string
    serialNumber: string
  }
}

export type HistoryAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'QUANTITY_CHANGE'

export interface CreateHistoryEntry {
  stockItemId: string
  action: HistoryAction
  oldValues?: any
  newValues?: any
  quantityChange?: number
  reason?: string
}

export interface HistoryFilter {
  action?: HistoryAction
  startDate?: string
  endDate?: string
  stockItemId?: string
  location?: string
}