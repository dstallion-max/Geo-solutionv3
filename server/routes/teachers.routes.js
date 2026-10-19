import express from 'express'
import { getAllTeachers, getTeacherProfile, addTeacher, updateTeacher, deleteTeacher } from '../controllers/teachers.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = express.Router()
router.use(requireAuth)

router.get('/', getAllTeachers)
router.get('/:id', getTeacherProfile)
router.post('/', requireRole(['admin']), addTeacher)
router.put('/:id', requireRole(['admin']), updateTeacher)
router.delete('/:id', requireRole(['admin']), deleteTeacher)

export default router