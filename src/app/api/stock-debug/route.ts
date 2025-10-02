import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Log the received data for debugging
    console.log('Received data:', JSON.stringify(body, null, 2))
    
    const { location, name, serialNumber, quantity, projectName, projectNumber, deliveryTime, image } = body

    // Validate required fields
    if (!location || !name || !serialNumber || !projectName || !projectNumber || !deliveryTime) {
      return NextResponse.json(
        { error: 'Missing required fields', received: body },
        { status: 400 }
      )
    }

    // Validate and convert quantity
    const parsedQuantity = parseInt(quantity)
    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
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

    return NextResponse.json({
      success: true,
      item: item,
      message: 'Item created successfully'
    })
    
  } catch (error) {
    console.error('Detailed error creating stock item:', error)
    
    // Return detailed error information
    return NextResponse.json(
      { 
        error: 'Failed to create stock item',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}