import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        VERCEL_ENV: process.env.VERCEL_ENV,
      },
      database: {
        url_exists: !!process.env.DATABASE_URL,
        url_type: process.env.DATABASE_URL?.includes('postgresql') ? 'PostgreSQL' : 
                 process.env.DATABASE_URL?.includes('sqlite') ? 'SQLite' : 'Unknown',
        url_preview: process.env.DATABASE_URL ? 
          `${process.env.DATABASE_URL.substring(0, 20)}...${process.env.DATABASE_URL.substring(process.env.DATABASE_URL.length - 20)}` : 
          'Not set',
        neon_indicators: {
          has_neon_host: process.env.DATABASE_URL?.includes('neon.tech') || false,
          has_ssl: process.env.DATABASE_URL?.includes('sslmode=require') || false,
          has_channel_binding: process.env.DATABASE_URL?.includes('channel_binding=require') || false,
        }
      }
    }

    // Try to test Prisma import
    let prismaStatus = 'unknown'
    try {
      const { prisma } = await import('@/lib/prisma')
      prismaStatus = 'imported_successfully'
      
      // Try basic connection
      await prisma.$connect()
      prismaStatus = 'connected_successfully'
      
      // Try a simple query
      const result = await prisma.$queryRaw`SELECT 1 as test`
      prismaStatus = 'query_successful'
      
      await prisma.$disconnect()
      
    } catch (prismaError) {
      prismaStatus = `error: ${prismaError instanceof Error ? prismaError.message : 'unknown_error'}`
    }

    return NextResponse.json({
      status: 'diagnostic_complete',
      prisma_status: prismaStatus,
      ...diagnostics
    })
    
  } catch (error) {
    return NextResponse.json({
      status: 'diagnostic_error',
      error: error instanceof Error ? error.message : 'unknown_error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}