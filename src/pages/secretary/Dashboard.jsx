import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Wallet, GraduationCap, Briefcase, CalendarCheck, Loader2 } from 'lucide-react'
import { formatNaira } from '../../lib/format'
import { apiRequest } from '../../lib/api'

export default function SecretaryDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        // We reuse the admin stats endpoint for the secretary dashboard
        const stats = await apiRequest('/dashboard/stats')
        setData(stats)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#00b4d8]" /></div>
  if (!data) return <div className="p-8 text-center text-red-500">Failed to load dashboard.</div>

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0f2b3d] dark:text-white">Overview</h1>
        <p className="text-sm text-[#64748b] dark:text-[#a0aec0] mt-1">Welcome back, Secretary. Here is today's snapshot.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={GraduationCap} label="Total Students" value={data.students.total} border="#0f2b3d" iconColor="#0f2b3d" />
        <StatCard icon={Briefcase} label="Present Today" value={data.attendance.present + data.attendance.late} border="#00b4d8" iconColor="#00b4d8" />
        <StatCard icon={Wallet} label="Net Income" value={formatNaira(data.finance.net)} border={data.finance.net >= 0 ? '#2d9b4e' : '#e63946'} iconColor={data.finance.net >= 0 ? '#2d9b4e' : '#e63946'} />
        <StatCard icon={CalendarCheck} label="Absent Today" value={data.attendance.absent} border="#e63946" iconColor="#e63946" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-base font-semibold text-[#0f2b3d] dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/secretary/registration" className="flex items-center gap-3 p-3 rounded-lg bg-[#0f2b3d]/5 dark:bg-white/5 hover:bg-[#0f2b3d]/10 transition">
              <GraduationCap className="w-5 h-5 text-[#0f2b3d] dark:text-white" />
              <span className="text-sm font-semibold text-[#0f2b3d] dark:text-white">Register Student</span>
            </Link>
            <Link to="/secretary/attendance" className="flex items-center gap-3 p-3 rounded-lg bg-[#00b4d8]/10 hover:bg-[#00b4d8]/20 transition">
              <CalendarCheck className="w-5 h-5 text-[#00b4d8]" />
              <span className="text-sm font-semibold text-[#00b4d8]">Log Attendance</span>
            </Link>
            <Link to="/secretary/teacher-attendance" className="flex items-center gap-3 p-3 rounded-lg bg-[#f4a261]/10 hover:bg-[#f4a261]/20 transition">
              <Briefcase className="w-5 h-5 text-[#f4a261]" />
              <span className="text-sm font-semibold text-[#f4a261]">Teacher Periods</span>
            </Link>
            <Link to="/secretary/finance-entry" className="flex items-center gap-3 p-3 rounded-lg bg-[#2d9b4e]/10 hover:bg-[#2d9b4e]/20 transition">
              <Wallet className="w-5 h-5 text-[#2d9b4e]" />
              <span className="text-sm font-semibold text-[#2d9b4e]">New Finance Entry</span>
            </Link>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h3 className="text-base font-semibold text-[#0f2b3d] dark:text-white mb-4">Financial Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 rounded-lg bg-[#2d9b4e]/5">
              <span className="text-sm text-[#64748b]">Total Income</span>
              <span className="font-bold text-[#2d9b4e]">{formatNaira(data.finance.income)}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-[#e63946]/5">
              <span className="text-sm text-[#64748b]">Total Expenses</span>
              <span className="font-bold text-[#e63946]">{formatNaira(data.finance.expenses)}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-[#0f2b3d]/5 dark:bg-white/5">
              <span className="text-sm text-[#64748b]">Net Balance</span>
              <span className="font-bold text-[#0f2b3d] dark:text-white">{formatNaira(data.finance.net)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, border, iconColor }) {
  return (
    <div className="glass-card rounded-xl p-3" style={{ borderLeft: `4px solid ${border}` }}>
      <Icon className="w-5 h-5 mb-1" style={{ color: iconColor }} />
      <p className="text-lg lg:text-xl font-bold text-[#0f2b3d] dark:text-white">{value}</p>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#64748b] dark:text-[#a0aec0] mt-0.5">{label}</p>
    </div>
  )
}