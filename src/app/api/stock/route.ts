import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { HistoryService } from '@/lib/historyService'

// GET all stock items
export async function GET() {
  try {
    const items = await prisma.stockItem.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching stock items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stock items' },
      { status: 500 }
    )
  }
}

// POST new stock item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received data:', JSON.stringify(body, null, 2))
    
    const { location, name, serialNumber, quantity, projectName, projectNumber, deliveryTime, image } = body

    // Validate required fields
    if (!location || !name || !serialNumber || !projectName || !projectNumber || !deliveryTime) {
      console.error('Missing required fields:', { location, name, serialNumber, projectName, projectNumber, deliveryTime })
      return NextResponse.json(
        { error: 'Missing required fields', received: body },
        { status: 400 }
      )
    }

    // Validate and convert quantity
    const parsedQuantity = parseInt(quantity)
    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      console.error('Invalid quantity:', quantity)
      return NextResponse.json(
        { error: 'Invalid quantity', quantity: quantity },
        { status: 400 }
      )
    }

    // Validate and convert date
    let parsedDate: Date
    try {
      parsedDate = new Date(deliveryTime)
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date')
      }
    } catch (dateError) {
      console.error('Invalid date format:', deliveryTime)
      return NextResponse.json(
        { error: 'Invalid delivery time format', deliveryTime: deliveryTime },
        { status: 400 }
      )
    }

    const item = await prisma.stockItem.create({
      data: {
        location: location.trim(),
        name: name.trim(),
        serialNumber: serialNumber.trim(),
        quantity: parsedQuantity,
        projectName: projectName.trim(),
        projectNumber: projectNumber.trim(),
        deliveryTime: parsedDate,
        image: image || null
      }
    })

    // Log the creation in history
    await HistoryService.logCreate(item)

    return NextResponse.json(item)
  } catch (error) {
    console.error('Detailed error creating stock item:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create stock item',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}