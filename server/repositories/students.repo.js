import { pool } from '../db/pool.js'

export const studentsRepo = {
  async createStudent(data) {
    const query = `
      INSERT INTO students (
        student_id, full_name, gender, dob, phone, email, address,
        student_type, course_dept, level, start_date, end_date, photo_url, form_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `
    const values = [
      data.student_id, data.full_name, data.gender, data.dob, data.phone, data.email, data.address,
      data.student_type, data.course_dept, data.level, data.start_date, data.end_date, data.photo_url, data.form_url
    ]
    const { rows } = await pool.query(query, values)
    return rows[0]
  },

  async createParent(data) {
    const query = `
      INSERT INTO parents (
        student_id, full_name, relationship, phone_call, phone_whatsapp, email, occupation, address
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `
    const values = [
      data.student_id, data.full_name, data.relationship, data.phone_call, data.phone_whatsapp, data.email, data.occupation, data.address
    ]
    const { rows } = await pool.query(query, values)
    return rows[0]
  },

  async getAll() {
    const { rows } = await pool.query('SELECT * FROM students ORDER BY created_at DESC')
    return rows
  },

  async getById(id) {
    const { rows } = await pool.query('SELECT * FROM students WHERE id = $1', [id])
    return rows[0]
  },
  
  async getParentByStudentId(studentId) {
    const { rows } = await pool.query('SELECT * FROM parents WHERE student_id = $1', [studentId])
    return rows[0]
  },

  async updateEndDate(id, newEndDate) {
    const { rows } = await pool.query(
      'UPDATE students SET end_date = $1, status = $2 WHERE id = $3 RETURNING *',
      [newEndDate, 'active', id]
    )
    return rows[0]
  }
}