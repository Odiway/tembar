'use client'

import { useState, useEffect } from 'react'
import StockList from '@/components/StockList'
import StockForm from '@/components/StockForm'
import StockSummary from '@/components/StockSummary'
import HistoryList from '@/components/HistoryList'
import { StockItem, CreateStockItem } from '@/types/stock'
import { StockService } from '@/lib/stockService'

export default function Home() {
  const [items, setItems] = useState<StockItem[]>([])
  const [editingItem, setEditingItem] = useState<StockItem | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showSummary, setShowSummary] = useState(true)
  const [showHistory, setShowHistory] = useState(false)
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
      const errorMessage = err instanceof Error ? err.message : 'Kaydetme sırasında hata oluştu'
      setError(errorMessage)
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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <header className="mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl font-bold">📦</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Stok Kontrol Sistemi
                  </h1>
                  <p className="text-gray-600 text-sm">Envanter yönetimi ve takibi</p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Bağlı</span>
              </div>
            </div>
            
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-red-500">⚠️</span>
                  <span>{error}</span>
                </div>
                <button 
                  onClick={() => setError(null)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  ✕
                </button>
              </div>
            )}
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setEditingItem(null)
                  setShowForm(true)
                }}
                disabled={loading}
                className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                <span className="mr-2">+</span>
                Yeni Ürün Ekle
              </button>
              <button
                onClick={handleExport}
                disabled={loading}
                className="inline-flex items-center px-4 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                <span className="mr-2">📥</span>
                Verileri İndir
              </button>
              <button
                onClick={() => setShowSummary(!showSummary)}
                className={`inline-flex items-center px-4 py-2.5 font-medium rounded-lg focus:ring-4 transition-all duration-200 shadow-md hover:shadow-lg ${
                  showSummary 
                    ? 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-200' 
                    : 'bg-white text-purple-600 border border-purple-200 hover:bg-purple-50 focus:ring-purple-200'
                }`}
              >
                <span className="mr-2">📊</span>
                İstatistikler
                <span className="ml-2">{showSummary ? '▲' : '▼'}</span>
              </button>
              <button
                onClick={() => setShowHistory(true)}
                className="inline-flex items-center px-4 py-2.5 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 focus:ring-4 focus:ring-orange-200 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <span className="mr-2">📋</span>
                Geçmiş
              </button>
              <button
                onClick={loadItems}
                disabled={loading}
                className="inline-flex items-center px-4 py-2.5 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                <span className={`mr-2 ${loading ? 'animate-spin' : ''}`}>🔄</span>
                Yenile
              </button>
            </div>
          </div>
        </header>

        {loading && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center mb-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse"></div>
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
              </div>
              <p className="text-gray-600 font-medium">Veriler yükleniyor...</p>
            </div>
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

        {/* History Modal */}
        {showHistory && (
          <HistoryList onClose={() => setShowHistory(false)} />
        )}
      </div>
    </main>
  )
}