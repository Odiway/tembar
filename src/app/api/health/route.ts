import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Check if tables exist
    const tableCount = await prisma.$queryRaw`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_name = 'stock_items'
    `
    
    await prisma.$disconnect()
    
    return NextResponse.json({ 
      status: 'connected', 
      database: process.env.DATABASE_URL?.includes('postgresql') ? 'PostgreSQL' : 'SQLite',
      tablesExist: Array.isArray(tableCount) && tableCount[0]?.count > 0
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json({ 
      status: 'error', 
      error: error instanceof Error ? error.message : 'Unknown error',
      database: process.env.DATABASE_URL?.includes('postgresql') ? 'PostgreSQL' : 'SQLite'
    }, { status: 500 })
  }
}