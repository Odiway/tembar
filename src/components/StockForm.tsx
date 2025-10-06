'use client'

import { useState, useRef } from 'react'
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

  const [showCamera, setShowCamera] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Use back camera on mobile
        } 
      })
      setStream(mediaStream)
      setShowCamera(true)
      
      // Set video source after a short delay to ensure video element is rendered
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      }, 100)
    } catch (err) {
      console.error('Error accessing camera:', err)
      alert('Kameraya erişim sağlanamadı. Lütfen tarayıcı izinlerini kontrol edin.')
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setShowCamera(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      // Set canvas size to video size
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      // Draw video frame to canvas
      context?.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      // Convert canvas to base64 image
      const imageData = canvas.toDataURL('image/jpeg', 0.8)
      setFormData(prev => ({ ...prev, image: imageData }))
      
      // Stop camera
      stopCamera()
    }
  }

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: '' }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Stop camera if it's running
    if (stream) {
      stopCamera()
    }
    onSave({
      ...formData,
      deliveryTime: formData.deliveryTime, // Ensure it's a string
      image: formData.image || undefined
    })
  }

  const handleCancel = () => {
    // Stop camera if it's running
    if (stream) {
      stopCamera()
    }
    onCancel()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <span className="mr-3">{item ? '✏️' : '➕'}</span>
            {item ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
          </h2>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  📍 Konum
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Depo konumunu girin"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  🏷️ Ürün Adı
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Ürün adını girin"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  🔢 Seri Numarası
                </label>
                <input
                  type="text"
                  required
                  value={formData.serialNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Seri numarasını girin"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  📦 Miktar
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Ürün miktarını girin"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  🏗️ Proje Adı
                </label>
                <input
                  type="text"
                  required
                  value={formData.projectName}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Proje adını girin"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  📋 Proje Numarası
                </label>
                <input
                  type="text"
                  required
                  value={formData.projectNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectNumber: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Proje numarasını girin"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  📅 Teslimat Zamanı
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.deliveryTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, deliveryTime: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  📸 Ürün Fotoğrafı
                </label>
                
                {!showCamera ? (
                  <div className="space-y-3">
                    {/* File Upload */}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    
                    {/* Camera Button */}
                    <button
                      type="button"
                      onClick={startCamera}
                      className="w-full inline-flex items-center justify-center px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <span className="mr-2">📷</span>
                      Fotoğraf Çek
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Camera View */}
                    <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 border-2 border-dashed border-white/30 rounded-lg pointer-events-none"></div>
                    </div>
                    
                    {/* Camera Controls */}
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        <span className="mr-2">📸</span>
                        Fotoğrafı Çek
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="px-4 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        ❌ İptal
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Hidden canvas for photo capture */}
                <canvas ref={canvasRef} style={{ display: 'none' }} />
              </div>
            </div>

            {formData.image && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    🖼️ Ürün Önizleme
                  </label>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                  >
                    🗑️ Fotoğrafı Sil
                  </button>
                </div>
                <img
                  src={formData.image}
                  alt="Ürün önizleme"
                  className="w-48 h-48 object-cover rounded-lg border-2 border-gray-200 shadow-md"
                />
              </div>
            )}
          </form>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2.5 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-200 transition-all duration-200"
          >
            İptal
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {item ? '✏️ Güncelle' : '💾 Kaydet'}
          </button>
        </div>
      </div>
    </div>
  )
}