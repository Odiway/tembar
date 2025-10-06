import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { HistoryService } from '@/lib/historyService'

// GET specific stock item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const item = await prisma.stockItem.findUnique({
      where: { id }
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { location, name, serialNumber, quantity, projectName, projectNumber, deliveryTime, image } = body

    // Get the old item first for history logging
    const oldItem = await prisma.stockItem.findUnique({
      where: { id }
    })

    if (!oldItem) {
      return NextResponse.json(
        { error: 'Stock item not found' },
        { status: 404 }
      )
    }

    const item = await prisma.stockItem.update({
      where: { id },
      data: {
        location: location.trim(),
        name: name.trim(),
        serialNumber: serialNumber.trim(),
        quantity: parseInt(quantity),
        projectName: projectName.trim(),
        projectNumber: projectNumber.trim(),
        deliveryTime: new Date(deliveryTime),
        image: image || null
      }
    })

    // Log the update in history
    await HistoryService.logUpdate(oldItem, item)

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Get the item first for history logging
    const item = await prisma.stockItem.findUnique({
      where: { id }
    })

    if (!item) {
      return NextResponse.json(
        { error: 'Stock item not found' },
        { status: 404 }
      )
    }

    // Log the deletion in history before deleting
    await HistoryService.logDelete(item)

    await prisma.stockItem.delete({
      where: { id }
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