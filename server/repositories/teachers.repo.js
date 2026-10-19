import { pool } from '../db/pool.js'

export const teachersRepo = {
  async getAll() {
    const { rows } = await pool.query(`
      SELECT t.*, u.full_name, u.email 
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      ORDER BY u.full_name ASC
    `)
    return rows
  },

  async getById(id) {
    const { rows } = await pool.query(`
      SELECT t.*, u.full_name, u.email 
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      WHERE t.id = $1
    `, [id])
    return rows[0]
  }
}