import { teachersRepo } from '../repositories/teachers.repo.js'
import { pool } from '../db/pool.js'
import { hashPin } from '../utils/password.js'

export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await teachersRepo.getAll()
    res.json(teachers)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const getTeacherProfile = async (req, res) => {
  try {
    const teacher = await teachersRepo.getById(req.params.id)
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' })
    res.json({ teacher })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const addTeacher = async (req, res) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const { full_name, email, pin, subject, rate_per_period } = req.body

    // 1. Create User
    const pin_hash = await hashPin(pin)
    const userRes = await client.query(
      `INSERT INTO users (email, pin_hash, full_name, role) VALUES ($1, $2, $3, 'teacher') RETURNING id`,
      [email.toLowerCase(), pin_hash, full_name]
    )
    const userId = userRes.rows[0].id

    // 2. Create Teacher Profile
    await client.query(
      `INSERT INTO teachers (user_id, subject, rate_per_period) VALUES ($1, $2, $3)`,
      [userId, subject, rate_per_period || 2000]
    )

    await client.query('COMMIT')
    res.status(201).json({ success: true })
  } catch (err) {
    await client.query('ROLLBACK')
    res.status(500).json({ error: err.message })
  } finally {
    client.release()
  }
}

export const updateTeacher = async (req, res) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const { full_name, email, subject, rate_per_period, pin } = req.body
    
    // 1. Find the teacher's user_id
    const tRes = await client.query('SELECT user_id FROM teachers WHERE id = $1', [req.params.id])
    if (tRes.rows.length === 0) throw new Error('Teacher not found')
    const userId = tRes.rows[0].user_id

    // 2. Update User
    if (pin) {
      const pin_hash = await hashPin(pin)
      await client.query('UPDATE users SET full_name=$1, email=$2, pin_hash=$3 WHERE id=$4', [full_name, email.toLowerCase(), pin_hash, userId])
    } else {
      await client.query('UPDATE users SET full_name=$1, email=$2 WHERE id=$3', [full_name, email.toLowerCase(), userId])
    }

    // 3. Update Teacher Profile
    await client.query('UPDATE teachers SET subject=$1, rate_per_period=$2 WHERE id=$3', [subject, rate_per_period, req.params.id])

    await client.query('COMMIT')
    res.json({ success: true })
  } catch (err) {
    await client.query('ROLLBACK')
    res.status(500).json({ error: err.message })
  } finally {
    client.release()
  }
}

export const deleteTeacher = async (req, res) => {
  try {
    // Because of ON DELETE CASCADE in the database schema, deleting the user will delete the teacher profile
    const tRes = await pool.query('SELECT user_id FROM teachers WHERE id = $1', [req.params.id])
    if (tRes.rows.length === 0) return res.status(404).json({ error: 'Teacher not found' })
    
    await pool.query('DELETE FROM users WHERE id = $1', [tRes.rows[0].user_id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}