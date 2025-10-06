import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const days = searchParams.get('days')

    // Test client-side date calculation
    let calculatedStartDate, calculatedEndDate
    if (days) {
      calculatedEndDate = new Date()
      calculatedStartDate = new Date()
      calculatedStartDate.setDate(calculatedStartDate.getDate() - parseInt(days))
    }

    return NextResponse.json({
      received: {
        startDate,
        endDate,
        days
      },
      calculated: {
        startDate: calculatedStartDate?.toISOString(),
        endDate: calculatedEndDate?.toISOString()
      },
      parsed: {
        startDate: startDate ? new Date(startDate).toISOString() : null,
        endDate: endDate ? new Date(endDate).toISOString() : null
      },
      currentTime: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}