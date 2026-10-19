import express from 'express'
import { getMessages, sendMessage, togglePin, deleteMessage } from '../controllers/chat.controller.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()
router.use(requireAuth)

router.get('/', getMessages)
router.post('/', sendMessage)
router.patch('/:id/pin', togglePin)
router.delete('/:id', deleteMessage)

export default router