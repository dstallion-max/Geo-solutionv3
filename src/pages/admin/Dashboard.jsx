import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Wallet, GraduationCap, Briefcase, TrendingUp, TrendingDown, Loader2, CalendarCheck } from 'lucide-react'
import { formatNaira } from '../../lib/format'
import { apiRequest } from '../../lib/api'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
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
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0f2b3d] dark:text-white">Administrative Overview</h1>
        <p className="text-sm text-[#64748b] dark:text-[#a0aec0] mt-1">Welcome back, Admin. Here is what's happening today.</p>
      </div>

      {/* Top 4 Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={GraduationCap} label="Total Students" value={data.students.total} border="#0f2b3d" iconColor="#0f2b3d" />
        <StatCard icon={Briefcase} label="Present Today" value={data.attendance.present + data.attendance.late} border="#00b4d8" iconColor="#00b4d8" />
        <StatCard icon={Wallet} label="Net Income" value={formatNaira(data.finance.net)} border={data.finance.net >= 0 ? '#2d9b4e' : '#e63946'} iconColor={data.finance.net >= 0 ? '#2d9b4e' : '#e63946'} />
        <StatCard icon={TrendingUp} label="Total Profit" value={formatNaira(data.finance.profit)} border="#f4a261" iconColor="#f4a261" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Financial Summary */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-base font-semibold text-[#0f2b3d] dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#2d9b4e]" /> Financial Summary
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-[10px] uppercase font-semibold text-[#64748b] dark:text-[#a0aec0]">Income</p>
              <p className="text-lg font-bold text-[#2d9b4e]">{formatNaira(data.finance.income)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-[#64748b] dark:text-[#a0aec0]">Expenses</p>
              <p className="text-lg font-bold text-[#e63946]">{formatNaira(data.finance.expenses)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-[#64748b] dark:text-[#a0aec0]">Net</p>
              <p className={`text-lg font-bold ${data.finance.net >= 0 ? 'text-[#0f2b3d] dark:text-white' : 'text-[#e63946]'}`}>
                {formatNaira(data.finance.net)}
              </p>
            </div>
          </div>
        </div>

        {/* Attendance Today */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-base font-semibold text-[#0f2b3d] dark:text-white mb-4 flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-[#00b4d8]" /> Attendance Today
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-[10px] uppercase font-semibold text-[#64748b] dark:text-[#a0aec0]">Present</p>
              <p className="text-lg font-bold text-[#2d9b4e]">{data.attendance.present}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-[#64748b] dark:text-[#a0aec0]">Late</p>
              <p className="text-lg font-bold text-[#f4a261]">{data.attendance.late}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-[#64748b] dark:text-[#a0aec0]">Absent</p>
              <p className="text-lg font-bold text-[#e63946]">{data.attendance.absent}</p>
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
      <div className="flex items-center justify-between mb-1">
        <Icon className="w-5 h-5" style={{ color: iconColor }} />
      </div>
      <p className="text-lg lg:text-xl font-bold text-[#0f2b3d] dark:text-white">{value}</p>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#64748b] dark:text-[#a0aec0] mt-0.5">{label}</p>
    </div>
  )
}