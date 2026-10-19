import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { env } from './config/env.js'

import authRoutes from './routes/auth.routes.js'
import studentsRoutes from './routes/students.routes.js'
import teachersRoutes from './routes/teachers.routes.js'
import attendanceRoutes from './routes/attendance.routes.js'
import financeRoutes from './routes/finance.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'
import teacherAttendanceRoutes from './routes/teacherAttendance.routes.js'
import chatRoutes from './routes/chat.routes.js'
import teacherPortalRoutes from './routes/teacherPortal.routes.js'

const app = express()

// CRITICAL: Tell Express to trust the Render proxy (so HTTPS cookies work)
app.set('trust proxy', 1)

app.use(helmet())
app.use(cors({ 
  origin: env.corsOrigin, 
  credentials: true 
}))
app.use(cookieParser())
app.use(express.json({ limit: '10mb' }))

// Mount Routes
app.use('/api/auth', authRoutes)
app.use('/api/students', studentsRoutes)
app.use('/api/teachers', teachersRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/finance', financeRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/teacher-attendance', teacherAttendanceRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/teacher-portal', teacherPortalRoutes)

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }))

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal Server Error' })
})

export default app