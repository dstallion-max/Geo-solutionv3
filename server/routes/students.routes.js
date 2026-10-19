import express from 'express'
import { registerStudent, getAllStudents, getStudentProfile, extendDuration } from '../controllers/students.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { upload, handleUploadErrors } from '../middleware/upload.js'

const router = express.Router()
router.use(requireAuth)

router.post('/register', requireRole(['admin', 'secretary']), upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'form', maxCount: 1 }]), handleUploadErrors, registerStudent)
router.get('/', getAllStudents)
router.get('/:id', getStudentProfile)
router.patch('/:id/extend', requireRole(['admin', 'secretary']), extendDuration)

export default router