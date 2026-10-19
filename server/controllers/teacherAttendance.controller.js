import { pool } from '../db/pool.js'

export const logTeacherAttendance = async (req, res) => {
  try {
    const { teacher_id, date, periods } = req.body
    if (!teacher_id || !date || !periods) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Get the teacher's current rate
    const tRes = await pool.query('SELECT rate_per_period FROM teachers WHERE id = $1', [teacher_id])
    if (tRes.rows.length === 0) return res.status(404).json({ error: 'Teacher not found' })
    const rate = tRes.rows[0].rate_per_period

    const { rows } = await pool.query(
      `INSERT INTO teacher_attendance (teacher_id, date, periods, rate_at_time)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (teacher_id, date) 
       DO UPDATE SET periods = teacher_attendance.periods + $3
       RETURNING *`,
      [teacher_id, date, periods, rate]
    )
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const getTeacherAttendance = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM teacher_attendance WHERE teacher_id = $1 ORDER BY date DESC',
      [req.params.teacherId]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const markAsPaid = async (req, res) => {
  try {
    const { ids } = req.body
    if (!ids || !ids.length) return res.status(400).json({ error: 'No records selected' })

    const today = new Date().toISOString().slice(0, 10)
    
    const { rows } = await pool.query(
      `UPDATE teacher_attendance 
       SET is_paid = true, paid_at = $1 
       WHERE id = ANY($2) RETURNING *`,
      [today, ids]
    )
    res.json({ success: true, updated: rows })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}