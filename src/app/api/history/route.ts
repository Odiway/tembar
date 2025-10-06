import { NextRequest, NextResponse } from 'next/server'
import { HistoryService } from '@/lib/historyService'

// GET history entries with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') as any
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const stockItemId = searchParams.get('stockItemId')
    const limit = searchParams.get('limit')

    const filters: any = {}
    
    if (action) filters.action = action
    if (startDate) filters.startDate = new Date(startDate)
    if (endDate) filters.endDate = new Date(endDate)
    if (stockItemId) filters.stockItemId = stockItemId
    if (limit) filters.limit = parseInt(limit)

    const history = await HistoryService.getHistory(filters)
    
    return NextResponse.json(history)
  } catch (error) {
    console.error('Error fetching history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    )
  }
}