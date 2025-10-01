'use client'

import { useState } from 'react'
import { StockItem, CreateStockItem } from '@/types/stock'

interface StockFormProps {
  item?: StockItem | null
  onSave: (item: CreateStockItem) => void
  onCancel: () => void
}

export default function StockForm({ item, onSave, onCancel }: StockFormProps) {
  const [formData, setFormData] = useState({
    location: item?.location || '',
    name: item?.name || '',
    serialNumber: item?.serialNumber || '',
    quantity: item?.quantity || 1,
    projectName: item?.projectName || '',
    projectNumber: item?.projectNumber || '',
    deliveryTime: item?.deliveryTime ? 
      (typeof item.deliveryTime === 'string' ? item.deliveryTime.slice(0, 16) : new Date(item.deliveryTime).toISOString().slice(0, 16)) 
      : '',
    image: item?.image || ''
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setFormData(prev => ({ ...prev, image: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      deliveryTime: formData.deliveryTime, // Ensure it's a string
      image: formData.image || undefined
    })
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {item ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Konum
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ürün Adı
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seri Numarası
            </label>
            <input
              type="text"
              required
              value={formData.serialNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Miktar
            </label>
            <input
              type="number"
              min="1"
              required
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proje Adı
            </label>
            <input
              type="text"
              required
              value={formData.projectName}
              onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proje Numarası
            </label>
            <input
              type="text"
              required
              value={formData.projectNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, projectNumber: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teslimat Zamanı
            </label>
            <input
              type="datetime-local"
              required
              value={formData.deliveryTime}
              onChange={(e) => setFormData(prev => ({ ...prev, deliveryTime: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ürün Fotoğrafı
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {formData.image && (
          <div className="mt-4">
            <img
              src={formData.image}
              alt="Ürün önizleme"
              className="w-32 h-32 object-cover rounded-md border"
            />
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            {item ? 'Güncelle' : 'Kaydet'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  )
}