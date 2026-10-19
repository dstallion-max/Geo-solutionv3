import { useState, useEffect } from 'react'
import { Calendar, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react'
import { apiRequest } from '../../lib/api'

export default function AdminAttendance() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await apiRequest(`/attendance/date?date=${date}`)
        setAttendance(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [date])

  const present = attendance.filter(a => a.status === 'present').length
  const late = attendance.filter(a => a.status === 'late').length
  const absent = attendance.filter(a => a.status === 'absent').length

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0f2b3d] dark:text-white">Attendance History</h1>
        <p className="text-sm text-[#64748b] dark:text-[#a0aec0] mt-1">View daily student check-ins</p>
      </div>

      <div className="glass-card rounded-xl p-3 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-[#73777d]" />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="px-3 py-2 rounded-lg border dark:border-[#2f3e52] bg-white dark:bg-[#0d1b2a] dark:text-white text-sm" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatMini icon={CheckCircle} label="Present" value={present} color="success" />
        <StatMini icon={Clock} label="Late" value={late} color="warning" />
        <StatMini icon={XCircle} label="Absent" value={absent} color="danger" />
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-[#00b4d8]" /></div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <table className="w-full text-sm">
             <thead className="bg-[#0f2b3d] text-white">
              <tr>
                <th className="px-4 py-3 text-left text-[10px] uppercase font-semibold">Name</th>
                <th className="px-4 py-3 text-left text-[10px] uppercase font-semibold">Matric</th>
                <th className="px-4 py-3 text-left text-[10px] uppercase font-semibold">Sign In</th>
                <th className="px-4 py-3 text-left text-[10px] uppercase font-semibold">Sign Out</th>
                <th className="px-4 py-3 text-left text-[10px] uppercase font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map(a => (
                <tr key={a.id} className="border-b border-[#c3c7cc]/10 dark:border-[#2f3e52]">
                  <td className="px-4 py-3 font-semibold text-[#0f2b3d] dark:text-white">{a.full_name}</td>
                  <td className="px-4 py-3 text-[#64748b]">{a.matric}</td>
                  <td className="px-4 py-3 font-mono text-xs">{a.sign_in?.slice(0,5) || '—'}</td>
                  <td className="px-4 py-3 font-mono text-xs">{a.sign_out?.slice(0,5) || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold ${a.status === 'present' ? 'bg-[#2d9b4e]/12 text-[#2d9b4e]' : 'bg-[#f4a261]/12 text-[#f4a261]'}`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
              {attendance.length === 0 && <tr><td colSpan="5" className="text-center py-6 text-[#94a3b8]">No attendance recorded for this date.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function StatMini({ icon: Icon, label, value, color }) {
  const map = { success: 'border-[#2d9b4e] text-[#2d9b4e]', warning: 'border-[#f4a261] text-[#f4a261]', danger: 'border-[#e63946] text-[#e63946]' }
  return (
    <div className={`glass-card rounded-xl p-3 border-l-4 ${map[color]}`}>
      <Icon className="w-4 h-4 mb-1" />
      <p className="text-lg font-bold text-[#0f2b3d] dark:text-white">{value}</p>
      <p className="text-[10px] font-semibold uppercase text-[#64748b] dark:text-[#a0aec0]">{label}</p>
    </div>
  )
}