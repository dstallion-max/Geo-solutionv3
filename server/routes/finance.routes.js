import express from 'express'
import { getAllTransactions, addTransaction, updateTransaction, deleteTransaction } from '../controllers/finance.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = express.Router()
router.use(requireAuth)

router.get('/', getAllTransactions)
router.post('/', requireRole(['admin', 'secretary']), addTransaction)
router.put('/:id', requireRole(['admin']), updateTransaction)
router.delete('/:id', requireRole(['admin']), deleteTransaction)

export default router