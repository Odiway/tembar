import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
    const { location, name, serialNumber, quantity, projectName, projectNumber, deliveryTime, image } = body

    const item = await prisma.stockItem.create({
      data: {
        location,
        name,
        serialNumber,
        quantity: parseInt(quantity),
        projectName,
        projectNumber,
        deliveryTime: new Date(deliveryTime),
        image
      }
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error creating stock item:', error)
    return NextResponse.json(
      { error: 'Failed to create stock item' },
      { status: 500 }
    )
  }
}