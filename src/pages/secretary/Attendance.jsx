import { useState, useEffect } from 'react'
import { Search, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react'
import { apiRequest } from '../../lib/api'

export default function SecretaryAttendance() {
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [actionLoading, setActionLoading] = useState(null)

  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    async function load() {
      try {
        const allStudents = await apiRequest('/students')
        setStudents(allStudents)

        const todayAtt = await apiRequest(`/attendance/date?date=${today}`)
        const attMap = {}
        todayAtt.forEach(rec => { attMap[rec.student_id] = rec })
        setAttendance(attMap)
      } catch (err) {
        console.error('Failed to load attendance', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [today])

  async function handleSignAction(student, type) {
    setActionLoading(student.id)
    const now = new Date()
    const timeStr = now.toTimeString().slice(0, 5) // HH:MM

    try {
      const payload = {
        student_id: student.id,
        date: today,
        sign_in: type === 'in' ? timeStr : attendance[student.id]?.sign_in,
        sign_out: type === 'out' ? timeStr : null,
        status: type === 'in' && timeStr > '09:00' ? 'late' : 'present'
      }

      const updated = await apiRequest('/attendance/log', {
        method: 'POST',
        body: payload
      })

      setAttendance(prev => ({ ...prev, [student.id]: updated }))
    } catch (err) {
      alert(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = students.filter(s => {
    const q = search.toLowerCase()
    return !q || s.full_name.toLowerCase().includes(q) || s.student_id.toLowerCase().includes(q)
  })

  const presentCount = Object.values(attendance).filter(a => a.status === 'present').length
  const lateCount = Object.values(attendance).filter(a => a.status === 'late').length
  const absentCount = students.length - (presentCount + lateCount)

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#00b4d8]" /></div>

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0f2b3d] dark:text-white">Attendance</h1>
        <p className="text-sm text-[#64748b] dark:text-[#a0aec0] mt-1">{today}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatMini icon={CheckCircle} label="Present" value={presentCount} color="success" />
        <StatMini icon={Clock} label="Late" value={lateCount} color="warning" />
        <StatMini icon={XCircle} label="Absent" value={absentCount} color="danger" />
      </div>

      <div className="glass-card rounded-xl p-3">
        <div className="flex items-center w-full px-3.5 py-2.5 rounded-lg border border-[#c3c7cc]/30 dark:border-[#2f3e52] bg-white/50 dark:bg-[#0d1b2a] focus-within:ring-2 focus-within:ring-[#00b4d8]/30 transition-all">
          <Search className="w-5 h-5 text-[#73777d] dark:text-[#a0aec0] shrink-0" />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            placeholder="Search students by name or ID…"
            className="flex-1 w-full bg-transparent border-none outline-none text-[#0f2b3d] dark:text-white text-sm pl-3 placeholder-[#94a3b8]" 
          />
        </div>
      </div>

      <div className="lg:hidden space-y-2">
        {filtered.map(p => {
          const record = attendance[p.id]
          return (
            <div key={p.id} className="glass-card rounded-xl p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[#0f2b3d] dark:text-white truncate">{p.full_name}</p>
                  <p className="text-xs text-[#64748b] dark:text-[#a0aec0] truncate">{p.student_id}</p>
                </div>
                {record ? (
                  <StatusPill status={record.status} />
                ) : (
                  <span className="text-[10px] font-bold text-[#94a3b8] uppercase">Not Logged</span>
                )}
              </div>
              <div className="flex items-center justify-between text-xs text-[#64748b] dark:text-[#a0aec0] mb-3">
                <span>In: <strong className="text-[#0f2b3d] dark:text-white">{record?.sign_in?.slice(0,5) || '—'}</strong></span>
                <span>Out: <strong className="text-[#0f2b3d] dark:text-white">{record?.sign_out?.slice(0,5) || '—'}</strong></span>
              </div>
              <div className="flex gap-2">
                {!record?.sign_in ? (
                  <button onClick={() => handleSignAction(p, 'in')} disabled={actionLoading === p.id}
                    className="flex-1 py-2.5 rounded-lg bg-[#2d9b4e] text-white text-sm font-semibold active:scale-95 disabled:opacity-50">
                    {actionLoading === p.id ? '...' : 'Sign In'}
                  </button>
                ) : !record?.sign_out ? (
                  <button onClick={() => handleSignAction(p, 'out')} disabled={actionLoading === p.id}
                    className="flex-1 py-2.5 rounded-lg bg-[#e63946] text-white text-sm font-semibold active:scale-95 disabled:opacity-50">
                    {actionLoading === p.id ? '...' : 'Sign Out'}
                  </button>
                ) : (
                  <div className="flex-1 py-2.5 rounded-lg bg-[#efedef] dark:bg-[#1b263b] text-center text-xs font-semibold text-[#94a3b8]">Completed</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Desktop Table (Simplified for Batch 1) */}
      <div className="hidden lg:block glass-card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#0f2b3d] text-white">
            <tr>
              <th className="px-4 py-3 text-left text-[10px] uppercase font-semibold">Name</th>
              <th className="px-4 py-3 text-left text-[10px] uppercase font-semibold">ID</th>
              <th className="px-4 py-3 text-left text-[10px] uppercase font-semibold">Sign In</th>
              <th className="px-4 py-3 text-left text-[10px] uppercase font-semibold">Sign Out</th>
              <th className="px-4 py-3 text-left text-[10px] uppercase font-semibold">Status</th>
              <th className="px-4 py-3 text-right text-[10px] uppercase font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const record = attendance[p.id]
              return (
                <tr key={p.id} className="border-b border-[#c3c7cc]/10 dark:border-[#2f3e52]">
                  <td className="px-4 py-3 font-semibold text-[#0f2b3d] dark:text-white">{p.full_name}</td>
                  <td className="px-4 py-3 text-[#64748b]">{p.student_id}</td>
                  <td className="px-4 py-3 font-mono text-xs">{record?.sign_in?.slice(0,5) || '—'}</td>
                  <td className="px-4 py-3 font-mono text-xs">{record?.sign_out?.slice(0,5) || '—'}</td>
                  <td className="px-4 py-3">{record ? <StatusPill status={record.status} /> : '—'}</td>
                  <td className="px-4 py-3 text-right">
                     {!record?.sign_in ? (
                        <button onClick={() => handleSignAction(p, 'in')} disabled={actionLoading === p.id} className="px-3 py-1.5 rounded-lg bg-[#2d9b4e] text-white text-xs font-semibold">Sign In</button>
                      ) : !record?.sign_out ? (
                        <button onClick={() => handleSignAction(p, 'out')} disabled={actionLoading === p.id} className="px-3 py-1.5 rounded-lg bg-[#e63946] text-white text-xs font-semibold">Sign Out</button>
                      ) : (
                        <span className="text-xs text-[#94a3b8]">Done</span>
                      )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
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

function StatusPill({ status }) {
  const map = { present: 'bg-[#2d9b4e]/12 text-[#2d9b4e]', late: 'bg-[#f4a261]/12 text-[#f4a261]', absent: 'bg-[#e63946]/12 text-[#e63946]' }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold ${map[status]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" /> {status}
    </span>
  )
}