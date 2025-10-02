import { NextResponse } from 'next/server'

export async function GET() {
  const connectionString = process.env.DATABASE_URL
  
  // Test multiple connection formats
  const testConnections = [
    {
      name: 'Original Pooled',
      url: 'postgresql://neondb_owner:npg_DTsP1p5QgmxU@ep-dark-math-adgwqnmx-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    },
    {
      name: 'Direct Connection',
      url: 'postgresql://neondb_owner:npg_DTsP1p5QgmxU@ep-dark-math-adgwqnmx.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require'
    },
    {
      name: 'Without Channel Binding',
      url: 'postgresql://neondb_owner:npg_DTsP1p5QgmxU@ep-dark-math-adgwqnmx-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require'
    }
  ]

  const results = []

  for (const test of testConnections) {
    try {
      // Create a new Prisma client with this connection string
      const { PrismaClient } = await import('@prisma/client')
      const testPrisma = new PrismaClient({
        datasources: {
          db: {
            url: test.url
          }
        }
      })

      await testPrisma.$connect()
      await testPrisma.$queryRaw`SELECT 1 as test`
      await testPrisma.$disconnect()
      
      results.push({
        name: test.name,
        status: 'SUCCESS',
        url: test.url.substring(0, 50) + '...'
      })
    } catch (error) {
      results.push({
        name: test.name,
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error',
        url: test.url.substring(0, 50) + '...'
      })
    }
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    current_connection: connectionString?.substring(0, 50) + '...',
    environment: process.env.VERCEL_ENV || 'local',
    test_results: results,
    recommendations: [
      'Check if Neon database is active in console',
      'Verify connection string is correct',
      'Try regenerating database password',
      'Check if database region matches Vercel region'
    ]
  })
}