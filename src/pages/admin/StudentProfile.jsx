import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, Mail, Phone, CalendarClock, Loader2, FileText, Download
} from 'lucide-react'
import Tabs from '../../components/ui/Tabs'
import Modal from '../../components/ui/Modal'
import { formatDate, daysUntil } from '../../lib/format'
import { apiRequest } from '../../lib/api'

const TABS = [
  { key: 'info', label: 'Personal' },
  { key: 'parent', label: 'Parent' },
  { key: 'documents', label: 'Documents' },
  { key: 'attendance', label: 'Attendance' },
  { key: 'duration', label: 'Duration' },
]

export default function StudentProfile() {
  const { id } = useParams()
  const [tab, setTab] = useState('info')
  
  const [student, setStudent] = useState(null)
  const [parent, setParent] = useState(null)
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)

  const [extendOpen, setExtendOpen] = useState(false)
  const [newEndDate, setNewEndDate] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await apiRequest(`/students/${id}`)
        setStudent(res.student)
        setParent(res.parent)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  async function handleExtend() {
    if (!newEndDate) return
    setSaving(true)
    try {
      await apiRequest(`/students/${id}/extend`, {
        method: 'PATCH',
        body: { newEndDate }
      })
      setStudent(s => ({ ...s, end_date: newEndDate, status: 'active' }))
      setExtendOpen(false)
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#00b4d8]" /></div>
  if (!student) return <div className="p-8 text-center text-red-500">Student not found</div>

  const days = daysUntil(student.end_date)

  return (
    <div className="space-y-5 animate-fade-in-up pb-20 lg:pb-8">
      <Link to="/admin/students" className="inline-flex items-center gap-1 text-sm text-[#64748b] dark:text-[#a0aec0] hover:text-[#0f2b3d] dark:hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to Students
      </Link>

      {/* Profile Header Card - Same as Teacher Profile */}
      <div className="glass-card rounded-xl p-4 sm:p-5 w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-[#0f2b3d] dark:bg-[#00b4d8] flex items-center justify-center text-2xl font-black text-white shrink-0 overflow-hidden">
            {student.photo_url ? (
              <img src={student.photo_url} alt={student.full_name} className="w-full h-full object-cover" />
            ) : (
              student.full_name.split(' ').map(w => w[0]).slice(0, 2).join('')
            )}
          </div>
          
          <div className="flex-1 min-w-0 w-full">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-xl md:text-2xl font-bold text-[#0f2b3d] dark:text-white truncate">{student.full_name}</h1>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase ${student.student_type === 'exam' ? 'bg-[#1a5f7a]/12 text-[#1a5f7a]' : 'bg-[#2d9b4e]/12 text-[#2d9b4e]'}`}>{student.student_type}</span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase ${student.status === 'active' ? 'bg-[#2d9b4e]/12 text-[#2d9b4e]' : 'bg-[#e63946]/12 text-[#e63946]'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />{student.status}
              </span>
            </div>
            <p className="text-sm text-[#64748b] dark:text-[#a0aec0] mt-0.5 font-mono truncate">{student.student_id} · {student.course_dept}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-xs text-[#64748b] dark:text-[#a0aec0]">
              <span className="flex items-center gap-1 truncate"><Mail className="w-3.5 h-3.5" /> {student.email || '—'}</span>
              <span className="flex items-center gap-1 truncate"><Phone className="w-3.5 h-3.5" /> {student.phone || '—'}</span>
            </div>
          </div>

          <div className="w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-[#c3c7cc]/20 dark:border-[#2f3e52] flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center md:pl-5 shrink-0">
            <div className="text-left md:text-right">
              <p className="text-[10px] uppercase tracking-wide text-[#64748b] dark:text-[#a0aec0] font-semibold">Duration ends</p>
              <p className="text-lg font-bold text-[#0f2b3d] dark:text-white">{formatDate(student.end_date)}</p>
              {days !== null && days > 0 && (
                <p className={`text-[11px] font-semibold mt-0.5 ${days <= 30 ? 'text-[#f4a261]' : 'text-[#64748b] dark:text-[#a0aec0]'}`}>{days} days left</p>
              )}
            </div>
            <button onClick={() => setExtendOpen(true)} className="mt-0 md:mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#1a5f7a] dark:text-[#00b4d8] bg-[#00b4d8]/10 px-3 py-1.5 md:px-0 md:py-0 md:bg-transparent rounded-lg md:rounded-none">
              <CalendarClock className="w-3.5 h-3.5" /> Extend
            </button>
          </div>
        </div>
      </div>

      {/* Tabs & Content */}
      <div className="glass-card rounded-xl overflow-hidden w-full">
        <div className="w-full overflow-x-auto">
          <Tabs tabs={TABS} active={tab} onChange={setTab} />
        </div>
        
        <div className="p-4 sm:p-5 w-full overflow-x-hidden">
          {tab === 'info' && <InfoTab s={student} />}
          {tab === 'parent' && <ParentTab p={parent} />}
          {tab === 'documents' && <DocumentsTab s={student} />}
          {tab === 'attendance' && <AttendanceTab rows={attendance} />}
          {tab === 'duration' && <DurationTab s={student} onExtend={() => setExtendOpen(true)} />}
        </div>
      </div>

      {/* Extend Modal */}
      <Modal
        open={extendOpen}
        onClose={() => setExtendOpen(false)}
        title="Extend Duration"
        footer={
          <>
            <button onClick={() => setExtendOpen(false)} className="flex-1 py-3 rounded-lg border border-[#c3c7cc]/40 dark:border-[#2f3e52] text-sm font-semibold dark:text-white">Cancel</button>
            <button onClick={handleExtend} disabled={saving} className="flex-1 py-3 rounded-lg bg-[#0f2b3d] dark:bg-[#00b4d8] text-white text-sm font-semibold disabled:opacity-50">
              {saving ? 'Saving...' : 'Extend'}
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-[#64748b] dark:text-[#a0aec0]">Current end date: <strong className="text-[#0f2b3d] dark:text-white">{formatDate(student.end_date)}</strong></p>
          <label className="block text-xs font-semibold text-[#64748b] dark:text-[#a0aec0] uppercase tracking-wide">New End Date</label>
          <input type="date" value={newEndDate} min={student.end_date} onChange={e => setNewEndDate(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-[#c3c7cc]/40 dark:border-[#2f3e52] bg-white dark:bg-[#0d1b2a] dark:text-white text-sm" />
          <div className="grid grid-cols-4 gap-2 pt-2">
            {[1, 3, 6, 12].map(m => (
              <button key={m} onClick={() => { const d = new Date(student.end_date); d.setMonth(d.getMonth() + m); setNewEndDate(d.toISOString().slice(0, 10)) }}
                className="py-2 rounded-lg border border-[#c3c7cc]/40 dark:border-[#2f3e52] text-xs font-semibold text-[#0f2b3d] dark:text-white hover:bg-[#f4f3f5] dark:hover:bg-[#2f3e52]">+{m}mo</button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  )
}

// Simple Data Row
function DataRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-[#c3c7cc]/10 dark:border-[#2f3e52] last:border-0 gap-1 sm:gap-4">
      <span className="text-[10px] sm:text-xs uppercase font-semibold text-[#64748b] dark:text-[#a0aec0] sm:w-1/3 shrink-0">{label}</span>
      <span className="text-sm font-medium text-[#0f2b3d] dark:text-white sm:text-right break-words w-full sm:w-2/3">{value || '—'}</span>
    </div>
  )
}

function InfoTab({ s }) {
  return (
    <div className="w-full">
      <DataRow label="Full Name" value={s.full_name} />
      <DataRow label="Matric Number" value={s.student_id} />
      <DataRow label="Gender" value={s.gender} />
      <DataRow label="Date of Birth" value={formatDate(s.dob)} />
      <DataRow label="Phone" value={s.phone} />
      <DataRow label="Email" value={s.email} />
      <DataRow label="Type" value={s.student_type} />
      <DataRow label="Course" value={s.course_dept} />
      <DataRow label="Address" value={s.address} />
    </div>
  )
}

function ParentTab({ p }) {
  if (!p) return <p className="text-sm text-[#64748b] py-4 text-center">No parent information provided.</p>
  return (
    <div className="w-full">
      <DataRow label="Full Name" value={p.full_name} />
      <DataRow label="Relationship" value={p.relationship} />
      <DataRow label="Phone (Call)" value={p.phone_call} />
      <DataRow label="Phone (WhatsApp)" value={p.phone_whatsapp} />
      <DataRow label="Email" value={p.email} />
      <DataRow label="Occupation" value={p.occupation} />
      <DataRow label="Address" value={p.address} />
    </div>
  )
}

function DocumentsTab({ s }) {
  return (
    <div className="space-y-3 w-full">
      {s.photo_url && (
        <div className="flex items-center justify-between p-3 rounded-lg border border-[#c3c7cc]/20 dark:border-[#2f3e52]">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-[#1a5f7a] dark:text-[#00b4d8] shrink-0" />
            <p className="text-sm font-semibold text-[#0f2b3d] dark:text-white">Passport Photo</p>
          </div>
          <a href={s.photo_url} target="_blank" rel="noreferrer" className="text-[#1a5f7a] dark:text-[#00b4d8] bg-[#00b4d8]/10 p-2 rounded-lg"><Download className="w-4 h-4" /></a>
        </div>
      )}
      {s.form_url && (
        <div className="flex items-center justify-between p-3 rounded-lg border border-[#c3c7cc]/20 dark:border-[#2f3e52]">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-[#1a5f7a] dark:text-[#00b4d8] shrink-0" />
            <p className="text-sm font-semibold text-[#0f2b3d] dark:text-white">Signed Form</p>
          </div>
          <a href={s.form_url} target="_blank" rel="noreferrer" className="text-[#1a5f7a] dark:text-[#00b4d8] bg-[#00b4d8]/10 p-2 rounded-lg"><Download className="w-4 h-4" /></a>
        </div>
      )}
      {!s.photo_url && !s.form_url && <p className="text-sm text-[#64748b] py-4 text-center">No documents uploaded.</p>}
    </div>
  )
}

function AttendanceTab({ rows }) {
  return (
    <div className="w-full">
      {rows.map((r, i) => (
        <div key={i} className="py-3 border-b border-[#c3c7cc]/10 dark:border-[#2f3e52] last:border-0">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-semibold dark:text-white">{formatDate(r.date)}</span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#efedef] dark:bg-[#0d1b2a]">{r.status}</span>
          </div>
          <div className="flex gap-4 text-xs text-[#64748b]">
            <span>In: <strong className="dark:text-white">{r.sign_in || '—'}</strong></span>
            <span>Out: <strong className="dark:text-white">{r.sign_out || '—'}</strong></span>
          </div>
        </div>
      ))}
      {rows.length === 0 && <p className="text-center py-6 text-[#94a3b8]">No attendance history.</p>}
    </div>
  )
}

function DurationTab({ s, onExtend }) {
  const days = daysUntil(s.end_date)
  const total = Math.ceil((new Date(s.end_date) - new Date(s.start_date)) / (1000 * 60 * 60 * 24))
  const elapsed = Math.max(0, total - (days || 0))
  const pct = Math.min(100, Math.round((elapsed / total) * 100))
  
  return (
    <div className="space-y-5 w-full">
      <div>
        <DataRow label="Start Date" value={formatDate(s.start_date)} />
        <DataRow label="End Date" value={formatDate(s.end_date)} />
        <DataRow label="Status" value={s.status} />
      </div>

      <div className="pt-2">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-[#64748b] dark:text-[#a0aec0]">{pct}% elapsed</span>
          <span className="font-semibold text-[#0f2b3d] dark:text-white">{days} days remaining</span>
        </div>
        <div className="h-3 rounded-full bg-[#efedef] dark:bg-[#2f3e52] overflow-hidden">
          <div className={`h-full rounded-full transition-all ${pct >= 90 ? 'bg-[#e63946]' : pct >= 70 ? 'bg-[#f4a261]' : 'bg-[#2d9b4e]'}`} style={{ width: `${pct}%` }} />
        </div>
      </div>

      <button onClick={onExtend} className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#0f2b3d] dark:bg-[#00b4d8] text-white text-sm font-semibold mt-2">
        <CalendarClock className="w-4 h-4" /> Extend Duration
      </button>
    </div>
  )
}