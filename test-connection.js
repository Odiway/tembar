const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn', 'info'],
})

async function testConnection() {
  try {
    console.log('🔍 Testing Neon PostgreSQL connection...')
    console.log('🔗 Connection string (masked):', process.env.DATABASE_URL?.substring(0, 30) + '...')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Successfully connected to database!')
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT NOW() as current_time, version() as pg_version`
    console.log('✅ Query result:', result)
    
    // Try to create our table
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
    console.log('✅ Table created successfully!')
    
    // List all tables
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    console.log('📋 Available tables:', tables)
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    console.error('📝 Error details:', {
      code: error.code,
      name: error.name,
      stack: error.stack?.split('\n')[0]
    })
  } finally {
    await prisma.$disconnect()
    console.log('🔌 Disconnected from database')
  }
}

testConnection()