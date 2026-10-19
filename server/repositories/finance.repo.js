import { pool } from '../db/pool.js'

export const financeRepo = {
  async getAll() {
    const { rows } = await pool.query('SELECT * FROM finance ORDER BY date DESC, created_at DESC')
    return rows
  },

  async add(data) {
    const { rows } = await pool.query(
      `INSERT INTO finance (type, category, customer_name, amount, actual_cost, method, description, date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [data.type, data.category, data.customer_name, data.amount, data.actual_cost || null, data.method, data.description, data.date]
    )
    return rows[0]
  },

  async delete(id) {
    await pool.query('DELETE FROM finance WHERE id = $1', [id])
    return true
  }
}