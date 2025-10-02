import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// This is a one-time setup endpoint - remove after migration
export async function POST() {
  try {
    console.log('🚀 Starting database setup...')
    
    // First, test connection
    await prisma.$connect()
    console.log('✅ Connected to database')
    
    // Create the table using Prisma's migration-like approach
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
    
    console.log('✅ Table created/verified')
    
    // Test inserting and deleting a record
    const testId = 'test-' + Date.now()
    await prisma.stockItem.create({
      data: {
        id: testId,
        location: 'Test Location',
        name: 'Test Item',
        serialNumber: 'TEST-001',
        quantity: 1,
        projectName: 'Test Project',
        projectNumber: 'TEST-001',
        deliveryTime: new Date(),
      }
    })
    
    await prisma.stockItem.delete({
      where: { id: testId }
    })
    
    console.log('✅ CRUD operations tested successfully')
    
    await prisma.$disconnect()

    return NextResponse.json({ 
      message: 'Database initialized successfully',
      database: 'PostgreSQL (Neon)',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Database setup error:', error)
    return NextResponse.json(
      { 
        error: 'Database setup failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any)?.code,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Also allow GET for easy browser testing
export async function GET() {
  return POST()
}