import { pool } from '../db/pool.js'

export const attendanceRepo = {
  async getByDate(date) {
    const { rows } = await pool.query(
      `SELECT sa.*, s.full_name, s.student_id as matric
       FROM student_attendance sa
       JOIN students s ON sa.student_id = s.id
       WHERE sa.date = $1`,
      [date]
    )
    return rows
  },

  async upsert(data) {
    const { rows } = await pool.query(
      `INSERT INTO student_attendance (student_id, date, sign_in, sign_out, status)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (student_id, date) 
       DO UPDATE SET sign_in = COALESCE($3, student_attendance.sign_in), 
                     sign_out = COALESCE($4, student_attendance.sign_out),
                     status = $5
       RETURNING *`,
      [data.student_id, data.date, data.sign_in || null, data.sign_out || null, data.status || 'present']
    )
    return rows[0]
  }
}