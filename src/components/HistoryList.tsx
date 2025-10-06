'use client'

import { useState, useEffect } from 'react'
import { StockHistory, HistoryAction } from '@/types/history'

interface HistoryListProps {
  onClose: () => void
}

export default function HistoryList({ onClose }: HistoryListProps) {
  const [history, setHistory] = useState<StockHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState({
    action: '' as HistoryAction | '',
    days: '7' // Last 7 days by default
  })

  useEffect(() => {
    loadHistory()
  }, [filter])

  const loadHistory = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (filter.action) {
        params.append('action', filter.action)
      }
      
      if (filter.days) {
        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - parseInt(filter.days))
        
        // Set time to beginning of start date and end of end date to be more inclusive
        startDate.setHours(0, 0, 0, 0)
        endDate.setHours(23, 59, 59, 999)
        
        console.log('Client filtering with dates:', {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          days: filter.days
        })
        
        params.append('startDate', startDate.toISOString())
        params.append('endDate', endDate.toISOString())
      }

      const response = await fetch(`/api/history?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch history')
      }
      
      const data = await response.json()
      setHistory(data)
      setError(null)
    } catch (err) {
      setError('Geçmiş veriler yüklenirken hata oluştu')
      console.error('Error loading history:', err)
    } finally {
      setLoading(false)
    }
  }

  const getActionColor = (action: HistoryAction) => {
    switch (action) {
      case 'CREATE': return 'text-green-600 bg-green-100'
      case 'UPDATE': return 'text-blue-600 bg-blue-100'
      case 'DELETE': return 'text-red-600 bg-red-100'
      case 'QUANTITY_CHANGE': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getActionText = (action: HistoryAction) => {
    switch (action) {
      case 'CREATE': return 'Eklendi'
      case 'UPDATE': return 'Güncellendi'
      case 'DELETE': return 'Silindi'
      case 'QUANTITY_CHANGE': return 'Miktar Değişti'
      default: return action
    }
  }

  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const parseValues = (values: string | undefined) => {
    if (!values) return null
    try {
      return JSON.parse(values)
    } catch {
      return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <span className="mr-3">📋</span>
              Stok Geçmişi
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-orange-200 text-2xl transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 border-b border-gray-200">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                📊 İşlem Türü
              </label>
              <select
                value={filter.action}
                onChange={(e) => setFilter(prev => ({ ...prev, action: e.target.value as HistoryAction | '' }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all duration-200"
              >
                <option value="">🌟 Tümü</option>
                <option value="CREATE">✅ Eklenen</option>
                <option value="UPDATE">✏️ Güncellenen</option>
                <option value="DELETE">❌ Silinen</option>
                <option value="QUANTITY_CHANGE">📊 Miktar Değişen</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                📅 Zaman Aralığı
              </label>
              <select
                value={filter.days}
                onChange={(e) => setFilter(prev => ({ ...prev, days: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all duration-200"
              >
                <option value="1">📅 Son 1 gün</option>
                <option value="7">📅 Son 7 gün</option>
                <option value="30">📅 Son 30 gün</option>
                <option value="90">📅 Son 90 gün</option>
                <option value="">🕒 Tüm zamanlar</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-96 p-6">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Yükleniyor...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {!loading && !error && history.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Seçilen filtrelere uygun geçmiş kaydı bulunamadı.
            </div>
          )}

          {!loading && !error && history.length > 0 && (
            <div className="space-y-4">
              {history.map((entry) => {
                const oldValues = parseValues(entry.oldValues)
                const newValues = parseValues(entry.newValues)
                
                return (
                  <div key={entry.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getActionColor(entry.action)}`}>
                          {getActionText(entry.action)}
                        </span>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {entry.stockItem?.name || 'Bilinmeyen Ürün'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {entry.stockItem?.location} • {entry.stockItem?.serialNumber}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {formatDate(entry.createdAt)}
                        </p>
                        {entry.quantityChange && (
                          <p className={`text-sm font-medium ${
                            entry.quantityChange > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {entry.quantityChange > 0 ? '+' : ''}{entry.quantityChange} adet
                          </p>
                        )}
                      </div>
                    </div>

                    {entry.reason && (
                      <p className="text-sm text-gray-600 mb-2">
                        📝 {entry.reason}
                      </p>
                    )}

                    {(oldValues || newValues) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-100">
                        {oldValues && (
                          <div>
                            <h4 className="text-xs font-medium text-gray-500 mb-1">Eski Değerler:</h4>
                            <div className="text-sm text-gray-600 space-y-1">
                              {oldValues.quantity && <p>Miktar: {oldValues.quantity}</p>}
                              {oldValues.location && <p>Konum: {oldValues.location}</p>}
                              {oldValues.projectName && <p>Proje: {oldValues.projectName}</p>}
                            </div>
                          </div>
                        )}
                        {newValues && (
                          <div>
                            <h4 className="text-xs font-medium text-gray-500 mb-1">Yeni Değerler:</h4>
                            <div className="text-sm text-gray-600 space-y-1">
                              {newValues.quantity && <p>Miktar: {newValues.quantity}</p>}
                              {newValues.location && <p>Konum: {newValues.location}</p>}
                              {newValues.projectName && <p>Proje: {newValues.projectName}</p>}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {history.length} kayıt gösteriliyor
            </p>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}