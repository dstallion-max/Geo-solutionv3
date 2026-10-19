import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, GraduationCap, Briefcase, Users, CalendarCheck,
  Wallet, MessageSquare, Settings, LogOut, Menu, X, Bell, Search, Sun, Moon, Plus
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const NAV = {
  admin: [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/students', label: 'Students', icon: GraduationCap },
    { to: '/admin/teachers', label: 'Teachers', icon: Briefcase },
    { to: '/admin/staff', label: 'Staff', icon: Users },
    { to: '/admin/attendance', label: 'Attendance', icon: CalendarCheck },
    { to: '/admin/finance', label: 'Finance', icon: Wallet },
    { to: '/admin/chat', label: 'Team Chat', icon: MessageSquare },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ],
  secretary: [
    { to: '/secretary', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/secretary/students', label: 'Students', icon: GraduationCap },
    { to: '/secretary/attendance', label: 'Attendance', icon: CalendarCheck },
    { to: '/secretary/teacher-attendance', label: 'Teacher Log', icon: Briefcase },
    { to: '/secretary/finance', label: 'Finance', icon: Wallet },
    { to: '/secretary/registration', label: 'Register', icon: Plus },
    { to: '/secretary/chat', label: 'Team Chat', icon: MessageSquare },
  ],
  teacher: [
    { to: '/teacher', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/teacher/profile', label: 'My Profile', icon: Users },
    { to: '/teacher/attendance', label: 'My Attendance', icon: CalendarCheck },
  ],
}

export default function AppShell({ children }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const nav = NAV[user?.role] || []

  function handleLogout() { logout(); navigate('/login') }

  return (
    <div className="min-h-screen flex bg-[#faf9fa] dark:bg-[#0d1b2a]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-[#0f2b3d] text-white fixed inset-y-0 left-0 z-30">
        <div className="px-6 py-5 border-b border-white/10">
          <h1 className="text-2xl font-black tracking-tight">Geo Solution</h1>
          <p className="text-xs text-[#c0e8ff]/60 uppercase tracking-widest mt-1">{user?.role} Portal</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {nav.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium mb-0.5 transition
                ${isActive ? 'bg-[#001624] text-[#c0e8ff] font-bold border-r-4 border-[#00b4d8]' : 'text-[#c0e8ff]/70 hover:bg-white/5 hover:text-white'}`}>
              <item.icon className="w-5 h-5" /> {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#c0e8ff]/20 border-2 border-[#c0e8ff]/30 flex items-center justify-center text-sm font-bold">
            {user?.name?.[0] || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{user?.name}</p>
            <p className="text-[11px] text-[#c0e8ff]/50 truncate">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="text-[#c0e8ff]/50 hover:text-white"><LogOut className="w-5 h-5" /></button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 h-full bg-[#0f2b3d] text-white flex flex-col">
            <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
              <div>
                <h1 className="text-lg font-black">Geo Solution</h1>
                <p className="text-[10px] text-[#c0e8ff]/60 uppercase tracking-widest">{user?.role} Portal</p>
              </div>
              <button onClick={() => setMobileOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <nav className="flex-1 overflow-y-auto py-2 px-2">
              {nav.map(item => (
                <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium mb-0.5
                    ${isActive ? 'bg-[#001624] text-[#c0e8ff] font-bold' : 'text-[#c0e8ff]/70'}`}>
                  <item.icon className="w-5 h-5" /> {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="p-4 border-t border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#c0e8ff]/20 flex items-center justify-center text-xs font-bold">{user?.name?.[0]}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{user?.name}</p>
                <p className="text-[10px] text-[#c0e8ff]/50 truncate">{user?.email}</p>
              </div>
              <button onClick={handleLogout}><LogOut className="w-4 h-4" /></button>
            </div>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white/95 dark:bg-[#1b263b]/95 backdrop-blur border-b border-[#c3c7cc]/20 dark:border-[#2f3e52] flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
          <button className="lg:hidden p-1" onClick={() => setMobileOpen(true)}>
            <Menu className="w-6 h-6 text-[#0f2b3d] dark:text-white" />
          </button>

          <div className="hidden lg:flex flex-1 max-w-md relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#73777d] dark:text-[#a0aec0]" />
            <input placeholder="Search…" className="w-full pl-10 pr-4 py-2 rounded-full bg-[#f4f3f5] dark:bg-[#0d1b2a] text-sm border-0 focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/20 dark:text-white" />
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-[#f4f3f5] dark:hover:bg-[#2f3e52]">
              {theme === 'dark' ? <Moon className="w-5 h-5 text-[#00b4d8]" /> : <Sun className="w-5 h-5 text-[#73777d]" />}
            </button>
            <button className="relative p-2 rounded-lg hover:bg-[#f4f3f5] dark:hover:bg-[#2f3e52]">
              <Bell className="w-5 h-5 text-[#73777d] dark:text-[#a0aec0]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#e63946]" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 pb-20 lg:pb-8">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 dark:bg-[#1b263b]/95 backdrop-blur border-t border-[#c3c7cc]/20 dark:border-[#2f3e52] flex justify-around py-1.5 z-20">
          {nav.slice(0, 5).map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1 text-[9px] font-semibold
                ${isActive ? 'text-[#0f2b3d] dark:text-[#00b4d8]' : 'text-[#94a3b8]'}`}>
              <item.icon className="w-5 h-5" /> {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}