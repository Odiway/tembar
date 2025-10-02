import { NextResponse } from 'next/server'
import { Pool } from 'pg'

export async function GET() {
  let pool: Pool | null = null
  
  try {
    const connectionString = process.env.DATABASE_URL
    
    if (!connectionString) {
      return NextResponse.json({
        status: 'error',
        message: 'DATABASE_URL not found'
      }, { status: 500 })
    }

    // Simple connection with minimal config
    pool = new Pool({
      connectionString: connectionString,
      ssl: {
        rejectUnauthorized: false
      },
      connectionTimeoutMillis: 15000,
      idleTimeoutMillis: 30000,
      max: 1
    })

    const client = await pool.connect()
    
    // Test simple query
    const result = await client.query('SELECT NOW() as current_time, version() as postgres_version')
    
    client.release()
    
    return NextResponse.json({
      status: 'success',
      message: 'Connected successfully to PostgreSQL',
      data: {
        current_time: result.rows[0].current_time,
        postgres_version: result.rows[0].postgres_version,
        connection_type: 'Pool connection successful'
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      error_code: error instanceof Error && 'code' in error ? (error as any).code : 'unknown',
      error_details: error instanceof Error ? error.stack : 'No stack trace'
    }, { status: 500 })
  } finally {
    if (pool) {
      try {
        await pool.end()
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  }
}