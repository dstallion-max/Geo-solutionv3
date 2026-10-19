import express from 'express'
import { getMyProfile, getMyAttendance } from '../controllers/teacherPortal.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = express.Router()
router.use(requireAuth, requireRole(['teacher']))

router.get('/profile', getMyProfile)
router.get('/attendance', getMyAttendance)

export default router