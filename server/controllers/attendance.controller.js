import { attendanceRepo } from '../repositories/attendance.repo.js'

export const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.query
    if (!date) return res.status(400).json({ error: 'Date required' })
    const data = await attendanceRepo.getByDate(date)
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const logAttendance = async (req, res) => {
  try {
    const updated = await attendanceRepo.upsert(req.body)
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}