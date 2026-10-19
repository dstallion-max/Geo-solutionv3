import pg from 'pg'
import { env } from '../config/env.js'

const { Pool } = pg

// Neon requires SSL. We turn off strict verification for ease of setup,
// but the connection is still encrypted.
export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: {
    rejectUnauthorized: false
  },
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000,
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle database client', err)
  process.exit(-1)
})

// Simple helper to run queries
export const query = (text, params) => pool.query(text, params)