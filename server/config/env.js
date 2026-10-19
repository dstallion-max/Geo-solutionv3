import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from the project root (two folders up from server/config)
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const requiredEnv = [
  'DATABASE_URL',
  'JWT_SECRET',
  'PORT',
  'CORS_ORIGIN'
]

requiredEnv.forEach(key => {
  if (!process.env[key]) {
    console.error(`❌ Missing required environment variable: ${key}`)
    process.exit(1)
  }
})

export const env = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpires: process.env.JWT_EXPIRES || '1h',
  sessionTimeout: parseInt(process.env.SESSION_TIMEOUT) || 600000,
  cookieName: process.env.COOKIE_NAME || 'geo_session',
  corsOrigin: process.env.CORS_ORIGIN,
  filebase: {
    accessKey: process.env.FILEBASE_ACCESS_KEY,
    secretKey: process.env.FILEBASE_SECRET_KEY,
    bucket: process.env.FILEBASE_BUCKET,
    endpoint: process.env.FILEBASE_ENDPOINT,
    region: process.env.FILEBASE_REGION,
  }
}