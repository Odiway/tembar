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
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          📍 Konumlara Göre Dağılım
        </h3>
        <div className="space-y-3">
          {Object.entries(locationBreakdown)
            .sort(([,a], [,b]) => b.count - a.count)
            .map(([location, data]) => (
              <div key={location} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{location}</div>
                  <div className="text-sm text-gray-600">
                    {data.items.length} farklı ürün
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">{data.count}</div>
                  <div className="text-sm text-gray-500">adet</div>
                </div>
              </div>
            ))}
        </div>
        {Object.keys(locationBreakdown).length === 0 && (
          <div className="text-center text-gray-500 py-4">
            Henüz konum verisi bulunmuyor
          </div>
        )}
      </div>

      {/* Project Summary */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          📋 Projelere Göre Dağılım
        </h3>
        <div className="space-y-3">
          {Object.entries(projectBreakdown)
            .sort(([,a], [,b]) => b.count - a.count)
            .map(([project, data]) => (
              <div key={project} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{project}</div>
                  <div className="text-sm text-gray-600">
                    {data.items.length} farklı ürün
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">{data.count}</div>
                  <div className="text-sm text-gray-500">adet</div>
                </div>
              </div>
            ))}
        </div>
        {Object.keys(projectBreakdown).length === 0 && (
          <div className="text-center text-gray-500 py-4">
            Henüz proje verisi bulunmuyor
          </div>
        )}
      </div>
    </div>
  )
}