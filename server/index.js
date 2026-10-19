import app from './app.js'
import { env } from './config/env.js'
import { pool } from './db/pool.js'

async function startServer() {
  try {
    // Test DB connection
    await pool.query('SELECT NOW()')
    console.log('✅ Database connected')

    app.listen(env.port, () => {
      console.log(`🚀 Server running on http://localhost:${env.port}`)
    })
  } catch (err) {
    console.error('❌ Failed to start server:', err)
    process.exit(1)
  }
}

startServer()