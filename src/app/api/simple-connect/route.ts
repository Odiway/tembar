import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { Pool } = require('pg')
    
    const connectionString = process.env.DATABASE_URL
    
    if (!connectionString) {
      return NextResponse.json({
        status: 'error',
        message: 'DATABASE_URL not found'
      }, { status: 500 })
    }

    // Simple connection with minimal config
    const pool = new Pool({
      connectionString: connectionString,
      ssl: {
        rejectUnauthorized: false
      },
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
      max: 1
    })

    try {
      const client = await pool.connect()
      
      // Test simple query
      const result = await client.query('SELECT NOW() as current_time, version() as postgres_version')
      
      client.release()
      await pool.end()
      
      return NextResponse.json({
        status: 'success',
        message: 'Connected successfully to PostgreSQL',
        data: {
          current_time: result.rows[0].current_time,
          postgres_version: result.rows[0].postgres_version,
          connection_type: 'Pool connection successful'
        }
      })
      
    } catch (connectError) {
      await pool.end()
      throw connectError
    }
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      error_code: error instanceof Error && 'code' in error ? error.code : 'unknown'
    }, { status: 500 })
  }
}