import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET specific stock item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.stockItem.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return NextResponse.json(
        { error: 'Stock item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error fetching stock item:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stock item' },
      { status: 500 }
    )
  }
}

// PUT update stock item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { location, name, serialNumber, quantity, projectName, projectNumber, deliveryTime, image } = body

    const item = await prisma.stockItem.update({
      where: { id: params.id },
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
    console.error('Error updating stock item:', error)
    return NextResponse.json(
      { error: 'Failed to update stock item' },
      { status: 500 }
    )
  }
}

// DELETE stock item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.stockItem.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Stock item deleted successfully' })
  } catch (error) {
    console.error('Error deleting stock item:', error)
    return NextResponse.json(
      { error: 'Failed to delete stock item' },
      { status: 500 }
    )
  }
}