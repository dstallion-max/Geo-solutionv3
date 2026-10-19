import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Mail, Calendar, Shield } from 'lucide-react'
import Tabs from '../../components/ui/Tabs'
import { formatDate } from '../../lib/format'

const MOCK_STAFF = {
  id: 'S-002',
  name: 'Mrs. Ngozi Eze',
  email: 'ngozi@geo.com',
  role: 'secretary',
  status: 'active',
  dateJoined: '2024-06-10',
  attendance: [
    { date: '2026-10-17', signIn: '08:30', signOut: '17:00', status: 'present' },
    { date: '2026-10-16', signIn: '08:45', signOut: '17:10', status: 'present' },
    { date: '2026-10-15', signIn: '09:20', signOut: '17:00', status: 'late' },
    { date: '2026-10-14', signIn: null, signOut: null, status: 'absent' },
  ],
}

const TABS = [
  { key: 'info', label: 'Info' },
  { key: 'attendance', label: 'Attendance' },
]

export default function StaffProfile() {
  const { id } = useParams()
  const [tab, setTab] = useState('info')
  const s = MOCK_STAFF

  return (
    <div className="space-y-5 animate-fade-in-up">
      <Link to="/admin/staff" className="inline-flex items-center gap-1 text-sm text-[#64748b] dark:text-[#a0aec0] hover:text-[#0f2b3d] dark:hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to Staff
      </Link>

      <div className="glass-card rounded-xl p-4 sm:p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-[#1a5f7a] flex items-center justify-center text-2xl font-black text-white shrink-0">
            {s.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-[#0f2b3d] dark:text-white">{s.name}</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#1a5f7a]/12 text-[#1a5f7a]"><Shield className="w-3 h-3" /> {s.role}</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#2d9b4e]/12 text-[#2d9b4e]"><span className="w-1.5 h-1.5 rounded-full bg-current" />{s.status}</span>
            </div>
            <div className="flex flex-wrap gap-4 mt-3 text-xs text-[#64748b] dark:text-[#a0aec0]">
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {s.email}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Joined {formatDate(s.dateJoined)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-5 pt-2"><Tabs tabs={TABS} active={tab} onChange={setTab} /></div>
        <div className="p-5">
          {tab === 'info' && (
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Name" value={s.name} />
              <Field label="Email" value={s.email} />
              <Field label="Role" value={s.role} />
              <Field label="Status" value={s.status} />
              <Field label="Date Joined" value={formatDate(s.dateJoined)} />
            </div>
          )}
          {tab === 'attendance' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#c3c7cc]/20 dark:border-[#2f3e52] text-left text-[10px] uppercase text-[#64748b] dark:text-[#a0aec0]">
                    <th className="py-2 font-semibold">Date</th>
                    <th className="py-2 font-semibold">Sign In</th>
                    <th className="py-2 font-semibold">Sign Out</th>
                    <th className="py-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {s.attendance.map((r, i) => {
                    const map = { present: 'bg-[#2d9b4e]/12 text-[#2d9b4e]', late: 'bg-[#f4a261]/12 text-[#f4a261]', absent: 'bg-[#e63946]/12 text-[#e63946]' }
                    return (
                      <tr key={i} className="border-b border-[#c3c7cc]/10 dark:border-[#2f3e52]/50 last:border-0">
                        <td className="py-2.5 dark:text-[#e0e1dd]">{formatDate(r.date)}</td>
                        <td className="py-2.5 font-mono text-xs dark:text-[#e0e1dd]">{r.signIn || '—'}</td>
                        <td className="py-2.5 font-mono text-xs dark:text-[#e0e1dd]">{r.signOut || '—'}</td>
                        <td className="py-2.5"><span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold ${map[r.status]}`}><span className="w-1.5 h-1.5 rounded-full bg-current" />{r.status}</span></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide font-semibold text-[#64748b] dark:text-[#a0aec0] mb-1">{label}</p>
      <p className="text-sm text-[#0f2b3d] dark:text-white capitalize">{value || '—'}</p>
    </div>
  )
}