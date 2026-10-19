import { pool } from '../db/pool.js'

// Get the logged-in teacher's own profile
export const getMyProfile = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT t.*, u.full_name, u.email 
       FROM teachers t
       JOIN users u ON t.user_id = u.id
       WHERE t.user_id = $1`,
      [req.user.id]
    )
    if (rows.length === 0) return res.status(404).json({ error: 'Teacher profile not found' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Get the logged-in teacher's attendance and payments
export const getMyAttendance = async (req, res) => {
  try {
    // First get the teacher ID
    const tRes = await pool.query('SELECT id FROM teachers WHERE user_id = $1', [req.user.id])
    if (tRes.rows.length === 0) return res.status(404).json({ error: 'Teacher profile not found' })
    const teacherId = tRes.rows[0].id

    const { rows } = await pool.query(
      'SELECT * FROM teacher_attendance WHERE teacher_id = $1 ORDER BY date DESC',
      [teacherId]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}