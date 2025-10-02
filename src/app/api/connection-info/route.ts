import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Simple connection test without Prisma
    const { Client } = require('pg')
    
    const connectionString = process.env.DATABASE_URL
    
    if (!connectionString) {
      return NextResponse.json({
        status: 'error',
        message: 'DATABASE_URL not found'
      }, { status: 500 })
    }

    // Parse the connection string
    const urlParts = connectionString.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):?(\d+)?\/(.+)/)
    
    if (!urlParts) {
      return NextResponse.json({
        status: 'error',
        message: 'Invalid connection string format'
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
        ssl_mode: connectionString.includes('sslmode=require') ? 'required' : 'optional',
        connection_type: host.includes('pooler') ? 'pooled' : 'direct',
        region: host.includes('us-east-1') ? 'US East 1' : 'unknown'
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