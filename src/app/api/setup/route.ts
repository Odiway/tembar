import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// This is a one-time setup endpoint - remove after migration
export async function POST() {
  try {
    // Run the migration manually
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "stock_items" (
        "id" TEXT NOT NULL,
        "location" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "serialNumber" TEXT NOT NULL,
        "quantity" INTEGER NOT NULL,
        "projectName" TEXT NOT NULL,
        "projectNumber" TEXT NOT NULL,
        "deliveryTime" TIMESTAMP(3) NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "image" TEXT,
        CONSTRAINT "stock_items_pkey" PRIMARY KEY ("id")
      );
    `

    return NextResponse.json({ message: 'Database initialized successfully' })
  } catch (error) {
    console.error('Database setup error:', error)
    return NextResponse.json(
      { error: 'Database setup failed', details: error },
      { status: 500 }
    )
  }
}