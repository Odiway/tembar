'use client'

import { useState, useEffect } from 'react'
import StockList from '@/components/StockList'
import StockForm from '@/components/StockForm'
import StockSummary from '@/components/StockSummary'
import { StockItem, CreateStockItem } from '@/types/stock'
import { StockService } from '@/lib/stockService'

export default function Home() {
  const [items, setItems] = useState<StockItem[]>([])
  const [editingItem, setEditingItem] = useState<StockItem | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showSummary, setShowSummary] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load data from SQLite database on component mount
  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    try {
      setLoading(true)
      const fetchedItems = await StockService.getAllItems()
      setItems(fetchedItems)
      setError(null)
    } catch (err) {
      setError('Veriler yüklenirken hata oluştu')
      console.error('Error loading items:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (item: CreateStockItem) => {
    try {
      setLoading(true)
      if (editingItem) {
        // Update existing item
        await StockService.updateItem({ ...item, id: editingItem.id })
      } else {
        // Add new item
        await StockService.createItem(item)
      }
      
      await loadItems() // Refresh the list
      setEditingItem(null)
      setShowForm(false)
      setError(null)
    } catch (err) {
      setError('Kaydetme sırasında hata oluştu')
      console.error('Error saving item:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item: StockItem) => {
    setEditingItem(item)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    try {
      setLoading(true)
      await StockService.deleteItem(id)
      await loadItems() // Refresh the list
      setError(null)
    } catch (err) {
      setError('Silme sırasında hata oluştu')
      console.error('Error deleting item:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const allItems = await StockService.exportData()
      const dataStr = JSON.stringify(allItems, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `stok-verileri-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError('Veri dışa aktarımında hata oluştu')
      console.error('Error exporting data:', err)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Stok Kontrol Sistemi (SQLite)
          </h1>
          
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
              <button 
                onClick={() => setError(null)}
                className="ml-2 text-red-900 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          )}
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => {
                setEditingItem(null)
                setShowForm(true)
              }}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              + Yeni Ürün Ekle
            </button>
            <button
              onClick={handleExport}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              📥 Verileri İndir
            </button>
            <button
              onClick={() => setShowSummary(!showSummary)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              📊 İstatistikler {showSummary ? '▲' : '▼'}
            </button>
            <button
              onClick={loadItems}
              disabled={loading}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              🔄 Yenile
            </button>
          </div>
        </header>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-600">Yükleniyor...</div>
          </div>
        )}

        {showSummary && items.length > 0 && (
          <StockSummary items={items} />
        )}

        {showForm && (
          <div className="mb-8">
            <StockForm
              item={editingItem}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false)
                setEditingItem(null)
              }}
            />
          </div>
        )}

        <StockList
          items={items}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </main>
  )
}