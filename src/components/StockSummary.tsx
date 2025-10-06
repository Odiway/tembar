'use client'

import { StockItem } from '@/types/stock'

interface StockSummaryProps {
  items: StockItem[]
}

export default function StockSummary({ items }: StockSummaryProps) {
  // Calculate statistics by location
  const getLocationBreakdown = () => {
    const breakdown: { [key: string]: { count: number; items: StockItem[] } } = {}
    
    items.forEach(item => {
      if (!breakdown[item.location]) {
        breakdown[item.location] = { count: 0, items: [] }
      }
      breakdown[item.location].count += item.quantity
      breakdown[item.location].items.push(item)
    })
    
    return breakdown
  }

  // Calculate statistics by project
  const getProjectBreakdown = () => {
    const breakdown: { [key: string]: { count: number; items: StockItem[] } } = {}
    
    items.forEach(item => {
      if (!breakdown[item.projectName]) {
        breakdown[item.projectName] = { count: 0, items: [] }
      }
      breakdown[item.projectName].count += item.quantity
      breakdown[item.projectName].items.push(item)
    })
    
    return breakdown
  }

  const locationBreakdown = getLocationBreakdown()
  const projectBreakdown = getProjectBreakdown()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Location Summary */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="mr-3">📍</span>
          Konumlara Göre Dağılım
        </h3>
        <div className="space-y-4">
          {Object.entries(locationBreakdown)
            .sort(([,a], [,b]) => b.count - a.count)
            .map(([location, data]) => (
              <div key={location} className="group hover:bg-gray-50 p-4 rounded-lg border border-gray-100 transition-all duration-200">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {location}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      📦 {data.items.length} farklı ürün
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-blue-600">{data.count}</div>
                    <div className="text-sm text-gray-500">adet</div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {Object.keys(locationBreakdown).length === 0 && (
          <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
            <span className="text-4xl mb-4 block">📍</span>
            Henüz konum verisi bulunmuyor
          </div>
        )}
      </div>

      {/* Project Summary */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="mr-3">🏗️</span>
          Projelere Göre Dağılım
        </h3>
        <div className="space-y-4">
          {Object.entries(projectBreakdown)
            .sort(([,a], [,b]) => b.count - a.count)
            .map(([project, data]) => (
              <div key={project} className="group hover:bg-gray-50 p-4 rounded-lg border border-gray-100 transition-all duration-200">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                      {project}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      📦 {data.items.length} farklı ürün
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-green-600">{data.count}</div>
                    <div className="text-sm text-gray-500">adet</div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {Object.keys(projectBreakdown).length === 0 && (
          <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
            <span className="text-4xl mb-4 block">🏗️</span>
            Henüz proje verisi bulunmuyor
          </div>
        )}
      </div>
    </div>
  )
}