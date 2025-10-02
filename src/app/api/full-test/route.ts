import { NextResponse } from 'next/server'
import { Pool, Client } from 'pg'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const results: any[] = []
  
  const connectionString = process.env.DATABASE_URL
  
  if (!connectionString) {
    return NextResponse.json({
      status: 'error',
      message: 'DATABASE_URL not found'
    }, { status: 500 })
  }

  // Test 1: Prisma Connection
  try {
    await prisma.$connect()
    const testQuery = await prisma.$queryRaw`SELECT NOW() as current_time`
    await prisma.$disconnect()
    
    results.push({
      method: 'Prisma ORM',
      status: 'success',
      data: testQuery
    })
  } catch (error) {
    results.push({
      method: 'Prisma ORM',
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }

  // Test 2: Direct Client Connection
  try {
    const client = new Client({
      connectionString: connectionString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000
    })
    
    await client.connect()
    const result = await client.query('SELECT NOW() as current_time')
    await client.end()
    
    results.push({
      method: 'Direct Client',
      status: 'success',
      data: result.rows[0]
    })
  } catch (error) {
    results.push({
      method: 'Direct Client',
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      code: error instanceof Error && 'code' in error ? (error as any).code : 'unknown'
    })
  }

  // Test 3: Pool Connection
  let pool: Pool | null = null
  try {
    pool = new Pool({
      connectionString: connectionString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
      max: 1
    })
    
    const client = await pool.connect()
    const result = await client.query('SELECT NOW() as current_time, version() as version')
    client.release()
    
    results.push({
      method: 'Pool Connection',
      status: 'success',
      data: result.rows[0]
    })
  } catch (error) {
    results.push({
      method: 'Pool Connection',
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      code: error instanceof Error && 'code' in error ? (error as any).code : 'unknown'
    })
  } finally {
    if (pool) {
      try {
        await pool.end()
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  }

  // Test 4: Environment Check
  const envCheck = {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL,
    VERCEL_ENV: process.env.VERCEL_ENV,
    DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
    DATABASE_URL_LENGTH: process.env.DATABASE_URL?.length || 0,
    DATABASE_URL_START: process.env.DATABASE_URL?.substring(0, 30) || 'not found'
  }

  const successCount = results.filter(r => r.status === 'success').length
  const errorCount = results.filter(r => r.status === 'error').length

  return NextResponse.json({
    summary: {
      total_tests: results.length,
      successful: successCount,
      failed: errorCount,
      overall_status: successCount > 0 ? 'partial_success' : 'all_failed'
    },
    environment: envCheck,
    detailed_results: results,
    recommendations: successCount === 0 ? [
      'Check if Neon database is active',
      'Verify connection string in Vercel environment variables',
      'Check network connectivity from Vercel to Neon',
      'Try using direct connection instead of pooled connection'
    ] : [
      'At least one connection method works',
      'Use the successful method for production'
    ]
  })
}