import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // Check if the history table already exists
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'stock_history'
      );
    ` as { exists: boolean }[]

    if (tableExists[0]?.exists) {
      return NextResponse.json({
        message: 'History table already exists',
        status: 'already_exists'
      })
    }

    // Create the history table
    await prisma.$executeRaw`
      CREATE TABLE "stock_history" (
          "id" TEXT NOT NULL,
          "stockItemId" TEXT NOT NULL,
          "action" TEXT NOT NULL,
          "oldValues" TEXT,
          "newValues" TEXT,
          "quantityChange" INTEGER,
          "reason" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

          CONSTRAINT "stock_history_pkey" PRIMARY KEY ("id")
      );
    `

    // Add the foreign key constraint
    await prisma.$executeRaw`
      ALTER TABLE "stock_history" ADD CONSTRAINT "stock_history_stockItemId_fkey" 
      FOREIGN KEY ("stockItemId") REFERENCES "stock_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `

    return NextResponse.json({
      message: 'History table created successfully',
      status: 'created'
    })

  } catch (error) {
    console.error('Error creating history table:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create history table',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}