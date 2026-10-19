import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Wallet, Clock, Loader2 } from 'lucide-react'
import { formatNaira } from '../../lib/format'
import { apiRequest } from '../../lib/api'

export default function TeacherDashboard() {
  const [profile, setProfile] = useState(null)
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const p = await apiRequest('/teacher-portal/profile')
        setProfile(p)
        const a = await apiRequest('/teacher-portal/attendance')
        setAttendance(a)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#00b4d8]" /></div>

  const totalPeriods = attendance.reduce((s, a) => s + a.periods, 0)
  const totalEarned = attendance.reduce((s, a) => s + (a.periods * a.rate_at_time), 0)

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0f2b3d] dark:text-white">
          Welcome, {profile?.full_name || 'Teacher'}
        </h1>
        <p className="text-sm text-[#64748b] dark:text-[#a0aec0] mt-1">Here is your teaching summary.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass-card rounded-xl p-4 border-l-4 border-[#00b4d8]">
          <Clock className="w-5 h-5 text-[#00b4d8] mb-1" />
          <p className="text-xl font-bold text-[#0f2b3d] dark:text-white">{totalPeriods}</p>
          <p className="text-[10px] font-semibold uppercase text-[#64748b]">Total Periods</p>
        </div>
        <div className="glass-card rounded-xl p-4 border-l-4 border-[#2d9b4e]">
          <Wallet className="w-5 h-5 text-[#2d9b4e] mb-1" />
          <p className="text-xl font-bold text-[#0f2b3d] dark:text-white">{formatNaira(totalEarned)}</p>
          <p className="text-[10px] font-semibold uppercase text-[#64748b]">Total Earned</p>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#c3c7cc]/20 dark:border-[#2f3e52]">
          <h3 className="text-sm font-semibold text-[#0f2b3d] dark:text-white">Recent Days Worked</h3>
        </div>
        <div className="divide-y divide-[#c3c7cc]/10 dark:divide-[#2f3e52]">
          {attendance.slice(0, 5).map(a => (
            <div key={a.id} className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#0f2b3d] dark:text-white">{new Date(a.date).toLocaleDateString()}</p>
                <p className="text-[11px] text-[#64748b]">{a.periods} periods</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#0f2b3d] dark:text-white">{formatNaira(a.periods * a.rate_at_time)}</p>
                {a.is_paid ? <span className="text-[10px] font-bold text-[#2d9b4e]">Paid</span> : <span className="text-[10px] font-bold text-[#f4a261]">Pending</span>}
              </div>
            </div>
          ))}
          {attendance.length === 0 && <div className="p-8 text-center text-sm text-[#94a3b8]">No days logged yet.</div>}
        </div>
        <Link to="/teacher/attendance" className="block w-full text-center py-3 border-t border-[#c3c7cc]/20 dark:border-[#2f3e52] text-xs font-semibold text-[#1a5f7a] dark:text-[#00b4d8]">
          View All Attendance
        </Link>
      </div>
    </div>
  )
}