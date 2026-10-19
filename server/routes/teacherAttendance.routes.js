import express from 'express'
import { logTeacherAttendance, getTeacherAttendance, markAsPaid } from '../controllers/teacherAttendance.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = express.Router()
router.use(requireAuth)

router.post('/log', requireRole(['admin', 'secretary']), logTeacherAttendance)
router.get('/:teacherId', requireRole(['admin', 'secretary']), getTeacherAttendance)
router.post('/pay', requireRole(['admin', 'secretary']), markAsPaid)

export default router