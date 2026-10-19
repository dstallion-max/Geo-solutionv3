import { pool } from '../db/pool.js'

export const getAdminStats = async (req, res) => {
  try {
    const studentsRes = await pool.query('SELECT COUNT(*) FROM students')
    const totalStudents = parseInt(studentsRes.rows[0].count)

    const today = new Date().toISOString().slice(0, 10)
    const attRes = await pool.query(
      "SELECT status, COUNT(*) FROM student_attendance WHERE date = $1 GROUP BY status",
      [today]
    )
    
    let present = 0, late = 0
    attRes.rows.forEach(row => {
      if (row.status === 'present') present = parseInt(row.count)
      if (row.status === 'late') late = parseInt(row.count)
    })

    const financeRes = await pool.query("SELECT type, amount, actual_cost FROM finance")
    let income = 0, expenses = 0, totalProfit = 0

    financeRes.rows.forEach(t => {
      if (t.type === 'income') {
        income += Number(t.amount)
        if (t.actual_cost != null) totalProfit += Math.max(0, t.amount - t.actual_cost)
      } else {
        expenses += Number(t.amount)
      }
    })

    res.json({
      students: { total: totalStudents },
      attendance: { present, late, absent: totalStudents - (present + late) },
      finance: { income, expenses, net: income - expenses, profit: totalProfit }
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}