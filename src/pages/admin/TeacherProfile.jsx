import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Mail, Briefcase, Loader2, CheckCircle, Wallet } from 'lucide-react'
import { formatNaira, formatDate } from '../../lib/format'
import { apiRequest } from '../../lib/api'
import Modal from '../../components/ui/Modal'

export default function TeacherProfile() {
  const { id } = useParams()
  const [teacher, setTeacher] = useState(null)
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [payModal, setPayModal] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const tData = await apiRequest(`/teachers/${id}`)
        setTeacher(tData.teacher)
        const aData = await apiRequest(`/teacher-attendance/${id}`)
        setAttendance(aData)
      } catch (err) { console.error(err) } 
      finally { setLoading(false) }
    }
    load()
  }, [id])

  async function markPaid(ids) {
    try {
      await apiRequest('/teacher-attendance/pay', { method: 'POST', body: { ids } })
      const aData = await apiRequest(`/teacher-attendance/${id}`)
      setAttendance(aData)
      setPayModal(null)
    } catch (err) { alert(err.message) }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#00b4d8]" /></div>
  if (!teacher) return <div className="p-8 text-center text-red-500">Teacher not found</div>

  const unpaid = attendance.filter(a => !a.is_paid)
  const totalEarned = attendance.reduce((s, a) => s + (a.periods * a.rate_at_time), 0)
  const totalPaid = attendance.filter(a => a.is_paid).reduce((s, a) => s + (a.periods * a.rate_at_time), 0)
  const totalUnpaid = totalEarned - totalPaid

  return (
    <div className="space-y-5 animate-fade-in-up">
      <Link to="/admin/teachers" className="inline-flex items-center gap-1 text-sm text-[#64748b] dark:text-[#a0aec0]">
        <ArrowLeft className="w-4 h-4" /> Back to Teachers
      </Link>

      <div className="glass-card rounded-xl p-5 flex flex-col md:flex-row gap-5 items-start md:items-center">
        <div className="w-20 h-20 rounded-full bg-[#0f2b3d] flex items-center justify-center text-2xl font-black text-white shrink-0">
          {teacher.full_name.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[#0f2b3d] dark:text-white">{teacher.full_name}</h1>
          <p className="text-sm text-[#64748b] mt-1">{teacher.subject} Teacher</p>
          <div className="flex gap-4 mt-2 text-xs text-[#64748b]">
            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {teacher.email}</span>
            <span className="flex items-center gap-1"><Wallet className="w-3 h-3" /> {formatNaira(teacher.rate_per_period)}/period</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase text-[#64748b]">Outstanding</p>
          <p className="text-2xl font-bold text-[#e63946]">{formatNaira(totalUnpaid)}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card rounded-xl p-4 border-l-4 border-[#0f2b3d]">
          <p className="text-[10px] font-bold uppercase text-[#64748b]">Total Earned</p>
          <p className="text-xl font-bold dark:text-white">{formatNaira(totalEarned)}</p>
        </div>
        <div className="glass-card rounded-xl p-4 border-l-4 border-[#2d9b4e]">
          <p className="text-[10px] font-bold uppercase text-[#64748b]">Paid</p>
          <p className="text-xl font-bold text-[#2d9b4e]">{formatNaira(totalPaid)}</p>
        </div>
        <div className="glass-card rounded-xl p-4 border-l-4 border-[#e63946]">
          <p className="text-[10px] font-bold uppercase text-[#64748b]">Unpaid</p>
          <p className="text-xl font-bold text-[#e63946]">{formatNaira(totalUnpaid)}</p>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#c3c7cc]/20 dark:border-[#2f3e52] flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#0f2b3d] dark:text-white">Attendance & Payments</h3>
          {unpaid.length > 0 && (
            <button onClick={() => setPayModal({ ids: unpaid.map(u => u.id) })} className="px-3 py-1.5 bg-[#2d9b4e] text-white text-xs font-semibold rounded-lg flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Mark All Unpaid as Paid
            </button>
          )}
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-[10px] uppercase text-[#64748b]">
                  <th className="py-2">Date</th>
                  <th className="py-2">Periods</th>
                  <th className="py-2 text-right">Amount</th>
                  <th className="py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map(a => (
                  <tr key={a.id} className="border-b border-[#c3c7cc]/10">
                    <td className="py-3 dark:text-white">{formatDate(a.date)}</td>
                    <td className="py-3 dark:text-white">{a.periods}</td>
                    <td className="py-3 text-right font-bold dark:text-white">{formatNaira(a.periods * a.rate_at_time)}</td>
                    <td className="py-3 text-right">
                      {a.is_paid ? (
                        <span className="text-[10px] font-bold text-[#2d9b4e] bg-[#2d9b4e]/10 px-2 py-1 rounded-full">Paid</span>
                      ) : (
                        <button onClick={() => setPayModal({ ids: [a.id] })} className="text-xs font-bold text-[#f4a261]">Mark Paid</button>
                      )}
                    </td>
                  </tr>
                ))}
                {attendance.length === 0 && <tr><td colSpan="4" className="text-center py-4 text-[#94a3b8]">No periods logged yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal open={!!payModal} onClose={() => setPayModal(null)} title="Confirm Payment" footer={
        <>
          <button onClick={() => setPayModal(null)} className="flex-1 py-3 border rounded-lg text-sm font-semibold dark:text-white">Cancel</button>
          <button onClick={() => markPaid(payModal.ids)} className="flex-1 py-3 bg-[#2d9b4e] text-white rounded-lg text-sm font-semibold">Confirm</button>
        </>
      }>
        <p className="text-sm text-[#64748b]">You are marking {payModal?.ids.length} day(s) as paid.</p>
      </Modal>
    </div>
  )
}