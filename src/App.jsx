import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import AppShell from './components/layout/AppShell'

// Public Pages
import Welcome from './pages/Welcome'
import Login from './pages/auth/Login'

// Admin
import AdminDashboard from './pages/admin/Dashboard'
import AdminStudents from './pages/admin/Students'
import AdminStudentProfile from './pages/admin/StudentProfile'
import AdminTeachers from './pages/admin/Teachers'
import AdminTeacherProfile from './pages/admin/TeacherProfile'
import AdminStaff from './pages/admin/Staff'
import AdminStaffProfile from './pages/admin/StaffProfile'
import AdminAttendance from './pages/admin/Attendance'
import AdminFinance from './pages/admin/Finance'
import AdminChat from './pages/admin/Chat'
import AdminSettings from './pages/admin/Settings'

// Secretary
import SecretaryDashboard from './pages/secretary/Dashboard'
import SecretaryAttendance from './pages/secretary/Attendance'
import SecretaryFinance from './pages/secretary/Finance'
import SecretaryFinanceEntry from './pages/secretary/FinanceEntry'
import SecretaryRegistration from './pages/secretary/Registration'
import SecretaryChat from './pages/secretary/Chat'
import SecretarySettings from './pages/secretary/Settings'
import SecretaryStudents from './pages/secretary/Students'
import SecretaryTeacherAttendance from './pages/secretary/TeacherAttendance'

// Teacher
import TeacherDashboard from './pages/teacher/Dashboard'
import TeacherProfilePage from './pages/teacher/MyProfile'
import TeacherAttendancePage from './pages/teacher/MyAttendance'
import TeacherPayments from './pages/teacher/MyPayments'

function Guard({ role, children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />

      {/* ADMIN */}
      <Route path="/admin/*" element={
        <Guard role="admin">
          <AppShell>
            <Routes>
              <Route index element={<AdminDashboard />} />
              <Route path="students" element={<AdminStudents />} />
              <Route path="students/:id" element={<AdminStudentProfile />} />
              <Route path="teachers" element={<AdminTeachers />} />
              <Route path="teachers/:id" element={<AdminTeacherProfile />} />
              <Route path="staff" element={<AdminStaff />} />
              <Route path="staff/:id" element={<AdminStaffProfile />} />
              <Route path="attendance" element={<AdminAttendance />} />
              <Route path="finance" element={<AdminFinance />} />
              <Route path="register" element={<SecretaryRegistration />} />
              <Route path="chat" element={<AdminChat />} />
              <Route path="settings" element={<AdminSettings />} />
            </Routes>
          </AppShell>
        </Guard>
      } />

      {/* SECRETARY */}
      <Route path="/secretary/*" element={
        <Guard role="secretary">
          <AppShell>
            <Routes>
              <Route index element={<SecretaryDashboard />} />
              <Route path="attendance" element={<SecretaryAttendance />} />
              <Route path="finance" element={<SecretaryFinance />} />
              <Route path="finance-entry" element={<SecretaryFinanceEntry />} />
              <Route path="registration" element={<SecretaryRegistration />} />
              <Route path="chat" element={<SecretaryChat />} />
              <Route path="settings" element={<SecretarySettings />} />
              <Route path="students" element={<SecretaryStudents />} />
              <Route path="teacher-attendance" element={<SecretaryTeacherAttendance />} />
            </Routes>
          </AppShell>
        </Guard>
      } />

      {/* TEACHER */}
      <Route path="/teacher/*" element={
        <Guard role="teacher">
          <AppShell>
            <Routes>
              <Route index element={<TeacherDashboard />} />
              <Route path="profile" element={<TeacherProfilePage />} />
              <Route path="attendance" element={<TeacherAttendancePage />} />
              <Route path="payments" element={<TeacherPayments />} />
            </Routes>
          </AppShell>
        </Guard>
      } />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}