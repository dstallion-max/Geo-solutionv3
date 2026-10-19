import express from 'express'
import { getAttendanceByDate, logAttendance } from '../controllers/attendance.controller.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()
router.use(requireAuth)

router.get('/date', getAttendanceByDate)
router.post('/log', logAttendance)

export default router