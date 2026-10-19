import { studentsRepo } from '../repositories/students.repo.js'
import { uploadFile } from '../utils/s3.js'
import crypto from 'crypto'

export const registerStudent = async (req, res) => {
  try {
    if (!req.body || !req.body.full_name) {
      return res.status(400).json({ error: 'Form data not received.' })
    }

    const {
      full_name, gender, dob, phone, email, address,
      student_type, course_dept, level, start_date, end_date,
      parent_name, parent_relationship, parent_phone_call, parent_phone_whatsapp, parent_email, parent_occupation, parent_address
    } = req.body

    const student_id = 'GEO-' + crypto.randomInt(10000, 99999)
    let photo_url = null
    let form_url = null

    if (req.files) {
      if (req.files.photo) photo_url = await uploadFile(req.files.photo[0], 'photos')
      if (req.files.form) form_url = await uploadFile(req.files.form[0], 'documents')
    }

    const student = await studentsRepo.createStudent({
      student_id, full_name, gender, dob, phone, email, address,
      student_type, course_dept, level, start_date, end_date, photo_url, form_url
    })

    await studentsRepo.createParent({
      student_id: student.id,
      full_name: parent_name,
      relationship: parent_relationship,
      phone_call: parent_phone_call,
      phone_whatsapp: parent_phone_whatsapp,
      email: parent_email,
      occupation: parent_occupation,
      address: parent_address
    })

    res.status(201).json({ success: true, student })
  } catch (err) {
    console.error('Registration error:', err)
    res.status(500).json({ error: err.message || 'Failed to register student' })
  }
}

export const getAllStudents = async (req, res) => {
  try {
    const students = await studentsRepo.getAll()
    res.json(students)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students' })
  }
}

export const getStudentProfile = async (req, res) => {
  try {
    const student = await studentsRepo.getById(req.params.id)
    if (!student) return res.status(404).json({ error: 'Student not found' })
    const parent = await studentsRepo.getParentByStudentId(student.id)
    res.json({ student, parent })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
}

export const extendDuration = async (req, res) => {
  try {
    const { newEndDate } = req.body
    if (!newEndDate) return res.status(400).json({ error: 'New end date is required' })
    const student = await studentsRepo.updateEndDate(req.params.id, newEndDate)
    res.json({ success: true, student })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}