import { pool } from './pool.js'
import { hashPin } from '../utils/password.js'

async function seed() {
  console.log('🌱 Seeding database...')
  
  const users = [
    { email: process.env.SEED_ADMIN_EMAIL, pin: process.env.SEED_ADMIN_PIN, name: 'Administrator', role: 'admin' },
    { email: process.env.SEED_SECRETARY_EMAIL, pin: process.env.SEED_SECRETARY_PIN, name: 'Secretary', role: 'secretary' },
    { email: process.env.SEED_TEACHER_EMAIL, pin: process.env.SEED_TEACHER_PIN, name: 'Mr. Samuel Adeyemi', role: 'teacher' }
  ]

  try {
    for (const u of users) {
      if (!u.email || !u.pin) continue
      const hash = await hashPin(u.pin)
      
      // Insert or update if exists
      await pool.query(
        `INSERT INTO users (email, pin_hash, full_name, role) 
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (email) 
         DO UPDATE SET pin_hash = $2, full_name = $3, role = $4`,
        [u.email.toLowerCase(), hash, u.name, u.role]
      )
      console.log(`✅ User created/updated: ${u.email}`)
    }
    console.log('✅ Seeding complete!')
  } catch (err) {
    console.error('❌ Seed failed:', err)
  } finally {
    await pool.end()
  }
}

seed()