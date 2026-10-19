import { financeRepo } from '../repositories/finance.repo.js'

export const getAllTransactions = async (req, res) => {
  try {
    const data = await financeRepo.getAll()
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const addTransaction = async (req, res) => {
  try {
    const { type, category, customer_name, amount, actual_cost, method, description, date } = req.body
    if (!type || !category || !amount) {
      return res.status(400).json({ error: 'Type, category, and amount are required' })
    }

    // v2 Logic: actual_cost only applies to income
    const parsedActualCost = (type === 'income' && actual_cost !== undefined && actual_cost !== null && actual_cost !== '')
      ? Number(actual_cost)
      : null

    const data = await financeRepo.add({
      type, category, customer_name, amount: Number(amount), actual_cost: parsedActualCost, method, description, date
    })
    res.status(201).json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}


export const updateTransaction = async (req, res) => {
  try {
    const { type, category, customer_name, amount, actual_cost, method, description, date } = req.body
    const parsedActualCost = (type === 'income' && actual_cost !== undefined && actual_cost !== null && actual_cost !== '')
      ? Number(actual_cost)
      : null

    const { rows } = await pool.query(
      `UPDATE finance 
       SET type=$1, category=$2, customer_name=$3, amount=$4, actual_cost=$5, method=$6, description=$7, date=$8
       WHERE id=$9 RETURNING *`,
      [type, category, customer_name, Number(amount), parsedActualCost, method, description, date, req.params.id]
    )
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}


export const deleteTransaction = async (req, res) => {
  try {
    await financeRepo.delete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}