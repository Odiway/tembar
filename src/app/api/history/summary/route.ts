import { NextRequest, NextResponse } from 'next/server'
import { HistoryService } from '@/lib/historyService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'startDate and endDate are required' },
        { status: 400 }
      )
    }

    const summary = await HistoryService.getQuantityChangeSummary(
      new Date(startDate),
      new Date(endDate)
    )
    
    return NextResponse.json(summary)
  } catch (error) {
    console.error('Error fetching quantity summary:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quantity summary' },
      { status: 500 }
    )
  }
}