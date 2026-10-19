import { pool } from '../db/pool.js'
import { hashPin } from '../utils/password.js'

export const getAllUsers = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, full_name, email, role, created_at FROM users ORDER BY created_at DESC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const addUser = async (req, res) => {
  try {
    const { full_name, email, pin, role } = req.body
    if (!full_name || !email || !pin || !role) {
      return res.status(400).json({ error: 'All fields are required' })
    }
    const pin_hash = await hashPin(pin)
    const { rows } = await pool.query(
      `INSERT INTO users (email, pin_hash, full_name, role) VALUES ($1, $2, $3, $4) RETURNING id, full_name, email, role`,
      [email.toLowerCase(), pin_hash, full_name, role]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'Email already exists' })
    res.status(500).json({ error: err.message })
  }
}

export const updateUser = async (req, res) => {
  try {
    const { full_name, email, role, pin } = req.body
    let query = 'UPDATE users SET full_name = $1, email = $2, role = $3'
    let values = [full_name, email.toLowerCase(), role]
    
    if (pin && pin.length === 6) {
      const pin_hash = await hashPin(pin)
      query += ', pin_hash = $4 WHERE id = $5 RETURNING id, full_name, email, role'
      values.push(pin_hash, req.params.id)
    } else {
      query += ' WHERE id = $4 RETURNING id, full_name, email, role'
      values.push(req.params.id)
    }

    const { rows } = await pool.query(query, values)
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const deleteUser = async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}