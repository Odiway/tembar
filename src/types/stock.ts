export interface StockItem {
  id: string
  location: string
  name: string
  serialNumber: string
  quantity: number
  projectName: string
  projectNumber: string
  deliveryTime: string | Date
  createdAt: string | Date
  updatedAt?: string | Date
  image?: string | null
}

export interface CreateStockItem {
  location: string
  name: string
  serialNumber: string
  quantity: number
  projectName: string
  projectNumber: string
  deliveryTime: string
  image?: string
}

export interface UpdateStockItem extends CreateStockItem {
  id: string
}