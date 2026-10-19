import { useState, useEffect } from 'react'
import { Loader2, CheckCircle, Clock } from 'lucide-react'
import { formatNaira, formatDate } from '../../lib/format'
import { apiRequest } from '../../lib/api'

export default function TeacherMyAttendance() {
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await apiRequest('/teacher-portal/attendance')
        setAttendance(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const totalPeriods = attendance.reduce((s, a) => s + a.periods, 0)
  const totalEarned = attendance.reduce((s, a) => s + (a.periods * a.rate_at_time), 0)

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#00b4d8]" /></div>

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0f2b3d] dark:text-white">My Attendance & Payments</h1>
        <p className="text-sm text-[#64748b] dark:text-[#a0aec0] mt-1">Your periods worked and earnings</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="glass-card rounded-xl p-4 border-l-4 border-[#00b4d8]">
          <p className="text-[10px] font-bold uppercase text-[#64748b]">Total Periods</p>
          <p className="text-2xl font-bold dark:text-white">{totalPeriods}</p>
        </div>
        <div className="glass-card rounded-xl p-4 border-l-4 border-[#2d9b4e]">
          <p className="text-[10px] font-bold uppercase text-[#64748b]">Total Earned</p>
          <p className="text-2xl font-bold text-[#2d9b4e]">{formatNaira(totalEarned)}</p>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#0f2b3d] text-white">
            <tr>
              <th className="px-4 py-3 text-left text-[10px] uppercase">Date</th>
              <th className="px-4 py-3 text-right text-[10px] uppercase">Periods</th>
              <th className="px-4 py-3 text-right text-[10px] uppercase">Earned</th>
              <th className="px-4 py-3 text-left text-[10px] uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map(a => (
              <tr key={a.id} className="border-b border-[#c3c7cc]/10">
                <td className="px-4 py-3 dark:text-white">{formatDate(a.date)}</td>
                <td className="px-4 py-3 text-right dark:text-white">{a.periods}</td>
                <td className="px-4 py-3 text-right font-bold dark:text-white">{formatNaira(a.periods * a.rate_at_time)}</td>
                <td className="px-4 py-3">
                  {a.is_paid
                    ? <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#2d9b4e]/12 text-[#2d9b4e]"><CheckCircle className="w-3 h-3" /> Paid</span>
                    : <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#f4a261]/12 text-[#f4a261]"><Clock className="w-3 h-3" /> Pending</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}