import { useState, useEffect } from 'react'
import { Calendar, Search, Briefcase, Loader2, Save } from 'lucide-react'
import { apiRequest } from '../../lib/api'
import { formatNaira } from '../../lib/format'

export default function SecretaryTeacherAttendance() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  
  // Modal / Form State
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [periods, setPeriods] = useState(1)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const data = await apiRequest('/teachers')
        setTeachers(data)
      } catch (err) { console.error(err) } 
      finally { setLoading(false) }
    }
    load()
  }, [])

  async function handleLog(e) {
    e.preventDefault()
    if (!selectedTeacher || !periods) return
    setSaving(true)
    try {
      await apiRequest('/teacher-attendance/log', {
        method: 'POST',
        body: {
          teacher_id: selectedTeacher.id,
          date,
          periods: Number(periods)
        }
      })
      alert('Attendance logged successfully')
      setSelectedTeacher(null) // Close form
      setPeriods(1)
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const filtered = teachers.filter(t => 
    t.full_name.toLowerCase().includes(search.toLowerCase()) || 
    t.subject.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#00b4d8]" /></div>

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0f2b3d] dark:text-white">Teacher Attendance</h1>
        <p className="text-sm text-[#64748b] dark:text-[#a0aec0] mt-1">Log the periods taught by teachers</p>
      </div>

      {selectedTeacher ? (
        <div className="glass-card rounded-xl p-5 border-l-4 border-[#00b4d8]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#0f2b3d] dark:text-white">
              Log for {selectedTeacher.full_name}
            </h3>
            <button onClick={() => setSelectedTeacher(null)} className="text-sm text-[#e63946] font-semibold">Cancel</button>
          </div>
          
          <form onSubmit={handleLog} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1 dark:text-[#a0aec0]">Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required
                  className="w-full px-3 py-2.5 rounded-lg border dark:border-[#2f3e52] bg-white dark:bg-[#0d1b2a] dark:text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 dark:text-[#a0aec0]">Periods Taught</label>
                <input type="number" min="1" value={periods} onChange={e => setPeriods(e.target.value)} required
                  className="w-full px-3 py-2.5 rounded-lg border dark:border-[#2f3e52] bg-white dark:bg-[#0d1b2a] dark:text-white text-sm" />
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-[#2d9b4e]/10 flex justify-between items-center">
              <span className="text-sm font-semibold text-[#2d9b4e]">Estimated Pay</span>
              <span className="text-lg font-bold text-[#2d9b4e]">
                {formatNaira(periods * selectedTeacher.rate_per_period)}
              </span>
            </div>

            <button type="submit" disabled={saving} className="w-full py-3 rounded-lg bg-[#0f2b3d] text-white text-sm font-bold flex items-center justify-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Record'}
            </button>
          </form>
        </div>
      ) : (
        <>
          <div className="glass-card rounded-xl p-3">
            <div className="flex items-center w-full px-3.5 py-2.5 rounded-lg border border-[#c3c7cc]/30 dark:border-[#2f3e52] bg-white/50 dark:bg-[#0d1b2a]">
              <Search className="w-4 h-4 text-[#73777d] shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teachers..." className="flex-1 bg-transparent border-none outline-none text-sm pl-2 dark:text-white" />
            </div>
          </div>

          <div className="grid gap-2">
            {filtered.map(t => (
              <div key={t.id} className="glass-card rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0f2b3d]/10 dark:bg-white/10 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-[#0f2b3d] dark:text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0f2b3d] dark:text-white">{t.full_name}</p>
                    <p className="text-xs text-[#64748b]">{t.subject} · {formatNaira(t.rate_per_period)}/period</p>
                  </div>
                </div>
                <button onClick={() => setSelectedTeacher(t)} className="px-4 py-2 bg-[#00b4d8] hover:bg-[#0096c7] text-white text-xs font-bold rounded-lg">
                  Log Periods
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}