import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Loader2 } from 'lucide-react'
import { apiRequest } from '../../lib/api'
import { formatDate, daysUntil } from '../../lib/format'

export default function SecretaryStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    async function load() {
      try {
        const data = await apiRequest('/students')
        setStudents(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = students.filter(s => {
    const matchesSearch = s.full_name.toLowerCase().includes(search.toLowerCase()) || s.student_id.toLowerCase().includes(search.toLowerCase())
    const matchesType = filter === 'all' || s.student_type === filter
    return matchesSearch && matchesType
  })

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#00b4d8]" /></div>

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0f2b3d] dark:text-white">Students</h1>
          <p className="text-sm text-[#64748b] dark:text-[#a0aec0] mt-1">{students.length} registered</p>
        </div>
        <Link to="/secretary/registration" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0f2b3d] hover:bg-[#1a5f7a] text-white text-sm font-semibold">
          <Plus className="w-4 h-4" /> Register Student
        </Link>
      </div>

      <div className="glass-card rounded-xl p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center w-full sm:w-auto flex-1 px-3.5 py-2.5 rounded-lg border border-[#c3c7cc]/30 dark:border-[#2f3e52] bg-white/50 dark:bg-[#0d1b2a]">
            <Search className="w-4 h-4 text-[#73777d] shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or ID…" className="flex-1 bg-transparent border-none outline-none text-sm pl-2 dark:text-white" />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)} className="px-3 py-2.5 rounded-lg border border-[#c3c7cc]/30 dark:border-[#2f3e52] bg-white dark:bg-[#0d1b2a] dark:text-white text-sm">
            <option value="all">All Types</option>
            <option value="exam">Exam</option>
            <option value="training">Training</option>
          </select>
        </div>
      </div>

      <div className="lg:hidden space-y-2">
        {filtered.map(s => {
          const days = daysUntil(s.end_date)
          return (
            <Link key={s.id} to={`/secretary/students/${s.id}`} className="block glass-card rounded-xl p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[#0f2b3d] dark:text-white truncate">{s.full_name}</p>
                  <p className="text-xs text-[#64748b] dark:text-[#a0aec0] font-mono truncate">{s.student_id}</p>
                </div>
                <StatusBadge status={s.status} />
              </div>
              <div className="flex items-center justify-between text-xs mt-2">
                <span className="text-[#64748b] dark:text-[#a0aec0]">{s.course_dept}</span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#efedef] dark:bg-[#0d1b2a] text-[#64748b] dark:text-[#a0aec0]">{s.student_type}</span>
              </div>
              {s.status === 'active' && days !== null && days <= 30 && days > 0 && (
                <p className="text-xs text-[#f4a261] font-semibold mt-1">{days}d left · ends {formatDate(s.end_date)}</p>
              )}
            </Link>
          )
        })}
      </div>

      <div className="hidden lg:block glass-card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#0f2b3d] text-white">
            <tr>
              <th className="px-4 py-3 text-left text-[10px] uppercase font-semibold">Name</th>
              <th className="px-4 py-3 text-left text-[10px] uppercase font-semibold">ID</th>
              <th className="px-4 py-3 text-left text-[10px] uppercase font-semibold">Type</th>
              <th className="px-4 py-3 text-left text-[10px] uppercase font-semibold">Course</th>
              <th className="px-4 py-3 text-left text-[10px] uppercase font-semibold">End Date</th>
              <th className="px-4 py-3 text-left text-[10px] uppercase font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => {
              const days = daysUntil(s.end_date)
              return (
                <tr key={s.id} className="border-b border-[#c3c7cc]/10 dark:border-[#2f3e52] hover:bg-[#0f2b3d]/2 dark:hover:bg-white/5">
                  <td className="px-4 py-3 font-semibold text-[#0f2b3d] dark:text-white">
                    <Link to={`/secretary/students/${s.id}`}>{s.full_name}</Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[#64748b] dark:text-[#a0aec0]">{s.student_id}</td>
                  <td className="px-4 py-3"><span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#efedef] dark:bg-[#0d1b2a] text-[#64748b] dark:text-[#a0aec0]">{s.student_type}</span></td>
                  <td className="px-4 py-3 text-[#64748b] dark:text-[#a0aec0]">{s.course_dept}</td>
                  <td className="px-4 py-3 text-xs dark:text-[#e0e1dd]">
                    <p>{formatDate(s.end_date)}</p>
                    {s.status === 'active' && days !== null && days <= 30 && days > 0 && <p className="text-[#f4a261] font-semibold">{days}d left</p>}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const map = { active: 'bg-[#2d9b4e]/12 text-[#2d9b4e]', completed: 'bg-[#1a5f7a]/12 text-[#1a5f7a]', inactive: 'bg-[#e63946]/12 text-[#e63946]' }
  return <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold ${map[status] || map.inactive}`}><span className="w-1.5 h-1.5 rounded-full bg-current" /> {status}</span>
}