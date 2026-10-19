import express from 'express'
import { getAllUsers, addUser, updateUser, deleteUser } from '../controllers/users.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = express.Router()
router.use(requireAuth, requireRole(['admin']))

router.get('/', getAllUsers)
router.post('/add', addUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router