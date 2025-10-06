// Simple test script to run the history migration
async function runMigration() {
  try {
    const response = await fetch('https://tembar.vercel.app/api/migrate-history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const result = await response.json()
    console.log('Migration result:', result)
  } catch (error) {
    console.error('Migration error:', error)
  }
}

runMigration()