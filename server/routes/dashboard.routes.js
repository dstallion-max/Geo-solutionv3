import express from 'express'
import { getAdminStats } from '../controllers/dashboard.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = express.Router()

// Allow both admin and secretary to see the stats
router.use(requireAuth, requireRole(['admin', 'secretary']))

router.get('/stats', getAdminStats)

export default router