'use client'

import { useState } from 'react'
import { StockItem } from '@/types/stock'

interface StockListProps {
  items: StockItem[]
  onEdit: (item: StockItem) => void
  onDelete: (id: string) => void
}

export default function StockList({ items, onEdit, onDelete }: StockListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<keyof StockItem>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedProject, setSelectedProject] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Get unique locations and projects for filter dropdowns
  const uniqueLocations = [...new Set(items.map(item => item.location))].sort()
  const uniqueProjects = [...new Set(items.map(item => item.projectName))].sort()

  // Calculate statistics
  const getLocationStats = () => {
    const stats: { [key: string]: number } = {}
    items.forEach(item => {
      stats[item.location] = (stats[item.location] || 0) + item.quantity
    })
    return stats
  }

  const getProjectStats = () => {
    const stats: { [key: string]: number } = {}
    items.forEach(item => {
      stats[item.projectName] = (stats[item.projectName] || 0) + item.quantity
    })
    return stats
  }

  const filteredAndSortedItems = items
    .filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.projectNumber.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesLocation = !selectedLocation || item.location === selectedLocation
      const matchesProject = !selectedProject || item.projectName === selectedProject
      
      return matchesSearch && matchesLocation && matchesProject
    })
    .sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue, 'tr')
          : bValue.localeCompare(aValue, 'tr')
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      return 0
    })

  const handleSort = (field: keyof StockItem) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR')
  }

  const confirmDelete = (item: StockItem) => {
    if (window.confirm(`"${item.name}" ürününü silmek istediğinize emin misiniz?`)) {
      onDelete(item.id)
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedLocation('')
    setSelectedProject('')
  }

  const locationStats = getLocationStats()
  const projectStats = getProjectStats()
  const totalQuantity = filteredAndSortedItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h2 className="text-xl font-semibold">
              Stok Listesi ({filteredAndSortedItems.length} ürün, {totalQuantity} adet)
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                🔍 Filtreler {showFilters ? '▲' : '▼'}
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {(searchTerm || selectedLocation || selectedProject) && (
                <button
                  onClick={clearFilters}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                >
                  ✕ Temizle
                </button>
              )}
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Konuma Göre Filtrele
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Tüm Konumlar</option>
                    {uniqueLocations.map(location => (
                      <option key={location} value={location}>
                        {location} ({locationStats[location]} adet)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Project Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Projeye Göre Filtrele
                  </label>
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Tüm Projeler</option>
                    {uniqueProjects.map(project => (
                      <option key={project} value={project}>
                        {project} ({projectStats[project]} adet)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quick Stats */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hızlı İstatistikler
                  </label>
                  <div className="text-sm space-y-1">
                    <div>Toplam Konum: {uniqueLocations.length}</div>
                    <div>Toplam Proje: {uniqueProjects.length}</div>
                    <div>Seçili Toplam: {totalQuantity} adet</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {filteredAndSortedItems.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          {searchTerm || selectedLocation || selectedProject 
            ? 'Seçilen kriterlere uygun ürün bulunamadı.' 
            : 'Henüz ürün eklenmemiş.'
          }
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Fotoğraf</th>
                <th 
                  className="p-3 text-left cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  Ürün Adı {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="p-3 text-left cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('location')}
                >
                  Konum {sortBy === 'location' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-3 text-left">Seri No</th>
                <th 
                  className="p-3 text-left cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('quantity')}
                >
                  Miktar {sortBy === 'quantity' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-3 text-left">Proje</th>
                <th className="p-3 text-left">Teslimat</th>
                <th 
                  className="p-3 text-left cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('createdAt')}
                >
                  Oluşturulma {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-3 text-left">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedItems.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                        📦
                      </div>
                    )}
                  </td>
                  <td className="p-3 font-medium">{item.name}</td>
                  <td className="p-3">{item.location}</td>
                  <td className="p-3 font-mono text-sm">{item.serialNumber}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3">
                    <div className="text-sm">
                      <div className="font-medium">{item.projectName}</div>
                      <div className="text-gray-500">#{item.projectNumber}</div>
                    </div>
                  </td>
                  <td className="p-3 text-sm">
                    {formatDate(item.deliveryTime)}
                  </td>
                  <td className="p-3 text-sm text-gray-500">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => confirmDelete(item)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}