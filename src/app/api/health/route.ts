import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('🔍 Testing database connection...')
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
    console.log('DATABASE_URL type:', process.env.DATABASE_URL?.includes('postgresql') ? 'PostgreSQL' : 'Other')
    
    // Test basic connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    
    // Test query execution
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Query execution successful:', result)
    
    // Check if our table exists (Neon-compatible query)
    let tablesExist = false
    try {
      const tables = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'stock_items'
      `
      tablesExist = Array.isArray(tables) && tables.length > 0
      console.log('📊 Tables check:', tablesExist, tables)
    } catch (tableError) {
      console.log('⚠️  Table check error (but connection works):', tableError)
    }
    
    await prisma.$disconnect()
    
    return NextResponse.json({ 
      status: 'connected',
      database: 'PostgreSQL (Neon)',
      connection: 'success',
      tablesExist,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Database connection error:', error)
    
    return NextResponse.json({ 
      status: 'error',
      database: process.env.DATABASE_URL?.includes('postgresql') ? 'PostgreSQL (Neon)' : 'Unknown',
      error: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any)?.code,
      timestamp: new Date().toISOString(),
      connectionString: process.env.DATABASE_URL ? 'Set' : 'Missing'
    }, { status: 500 })
  }
}