import { pool } from '../db/pool.js'

export const getMessages = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT m.*, u.full_name as sender_name, u.role as sender_role
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       ORDER BY m.created_at ASC`
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body
    if (!text) return res.status(400).json({ error: 'Message text required' })

    const { rows } = await pool.query(
      `INSERT INTO messages (sender_id, text) VALUES ($1, $2) RETURNING *`,
      [req.user.id, text]
    )
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const togglePin = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE messages SET is_pinned = NOT is_pinned WHERE id = $1 RETURNING *`,
      [req.params.id]
    )
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const deleteMessage = async (req, res) => {
  try {
    // Only the sender or an admin can delete
    const msgRes = await pool.query('SELECT sender_id FROM messages WHERE id = $1', [req.params.id])
    if (msgRes.rows.length === 0) return res.status(404).json({ error: 'Not found' })
    
    if (msgRes.rows[0].sender_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    await pool.query('DELETE FROM messages WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}