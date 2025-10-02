import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const connectionString = process.env.DATABASE_URL
    
    if (!connectionString) {
      return NextResponse.json({
        status: 'error',
        message: 'DATABASE_URL not found'
      }, { status: 500 })
    }

    // Parse the connection string
    const urlParts = connectionString.match(/postgresql:\/\/([^:]+):([^@]+)@([^:\/]+):?(\d+)?\/(.+)/)
    
    if (!urlParts) {
      return NextResponse.json({
        status: 'error',
        message: 'Invalid connection string format',
        connection_string_length: connectionString.length,
        starts_with: connectionString.substring(0, 20)
      }, { status: 500 })
    }

    const [, username, password, host, port, database] = urlParts
    
    return NextResponse.json({
      status: 'connection_parsed',
      details: {
        host: host,
        port: port || '5432',
        database: database.split('?')[0], // Remove query params
        username: username,
        password_length: password ? password.length : 0,
        ssl_mode: connectionString.includes('sslmode=require') ? 'required' : 'optional',
        connection_type: host.includes('pooler') ? 'pooled' : 'direct',
        region: host.includes('us-east-1') ? 'US East 1' : 'unknown',
        full_host: host,
        query_params: database.includes('?') ? database.split('?')[1] : 'none'
      },
      next_step: 'Visit /api/simple-connect to test actual connection'
    })
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}