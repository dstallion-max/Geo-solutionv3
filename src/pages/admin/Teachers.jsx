import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Briefcase, Loader2, Trash2, Pencil } from 'lucide-react'
import { apiRequest } from '../../lib/api'
import { formatNaira } from '../../lib/format'
import Modal from '../../components/ui/Modal'

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', pin: '', subject: '', rate: 2000 })

  useEffect(() => {
    fetchTeachers()
  }, [])

  async function fetchTeachers() {
    try {
      const data = await apiRequest('/teachers')
      setTeachers(data)
    } catch (err) { console.error(err) } 
    finally { setLoading(false) }
  }

  function openAdd() {
    setEditingId(null)
    setForm({ name: '', email: '', pin: '', subject: '', rate: 2000 })
    setModalOpen(true)
  }

  function openEdit(teacher) {
    setEditingId(teacher.id)
    setForm({ name: teacher.full_name, email: teacher.email, pin: '', subject: teacher.subject, rate: teacher.rate_per_period })
    setModalOpen(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingId) {
        await apiRequest(`/teachers/${editingId}`, {
          method: 'PUT',
          body: { full_name: form.name, email: form.email, subject: form.subject, rate_per_period: Number(form.rate), pin: form.pin || undefined }
        })
      } else {
        await apiRequest('/teachers', {
          method: 'POST',
          body: { full_name: form.name, email: form.email, pin: form.pin, subject: form.subject, rate_per_period: Number(form.rate) }
        })
      }
      setModalOpen(false)
      fetchTeachers()
    } catch (err) { alert(err.message) } 
    finally { setSaving(false) }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure? This will delete the teacher and their login.')) return
    try {
      await apiRequest(`/teachers/${id}`, { method: 'DELETE' })
      fetchTeachers()
    } catch (err) { alert(err.message) }
  }

  const filtered = teachers.filter(t => t.full_name.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase()))

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#00b4d8]" /></div>

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0f2b3d] dark:text-white">Teachers</h1>
          <p className="text-sm text-[#64748b] dark:text-[#a0aec0] mt-1">{teachers.length} registered</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0f2b3d] text-white text-sm font-semibold">
          <Plus className="w-4 h-4" /> Add Teacher
        </button>
      </div>

      <div className="glass-card rounded-xl p-3">
        <div className="flex items-center w-full px-3.5 py-2.5 rounded-lg border border-[#c3c7cc]/30 dark:border-[#2f3e52] bg-white/50 dark:bg-[#0d1b2a]">
          <Search className="w-4 h-4 text-[#73777d] shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teachers..." className="flex-1 bg-transparent border-none outline-none text-sm pl-2 dark:text-white" />
        </div>
      </div>

      <div className="lg:hidden space-y-2">
        {filtered.map(t => (
          <div key={t.id} className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <Link to={`/admin/teachers/${t.id}`} className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#0f2b3d]/10 flex items-center justify-center shrink-0">
                  <Briefcase className="w-4 h-4 text-[#0f2b3d] dark:text-white" />
                </div>
                <div>
                  <p className="font-semibold text-[#0f2b3d] dark:text-white">{t.full_name}</p>
                  <p className="text-xs text-[#64748b]">{t.subject}</p>
                </div>
              </Link>
              <div className="flex gap-2">
                <button onClick={() => openEdit(t)} className="p-1.5 bg-[#e0f2fe] text-[#0369a1] rounded-lg"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(t.id)} className="p-1.5 bg-[#fee2e2] text-[#b91c1c] rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="flex justify-between text-xs">
               <span className="text-[#64748b]">Rate: <strong className="text-[#0f2b3d] dark:text-white">{formatNaira(t.rate_per_period)}</strong></span>
               <Link to={`/admin/teachers/${t.id}`} className="text-[#1a5f7a] font-semibold">View Profile →</Link>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden lg:block glass-card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#0f2b3d] text-white">
            <tr>
              <th className="px-4 py-3 text-left text-[10px] uppercase font-semibold">Name</th>
              <th className="px-4 py-3 text-left text-[10px] uppercase font-semibold">Subject</th>
              <th className="px-4 py-3 text-right text-[10px] uppercase font-semibold">Rate/Period</th>
              <th className="px-4 py-3 text-right text-[10px] uppercase font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id} className="border-b border-[#c3c7cc]/10 dark:border-[#2f3e52]">
                <td className="px-4 py-3 font-semibold text-[#0f2b3d] dark:text-white">
                  <Link to={`/admin/teachers/${t.id}`} className="hover:underline">{t.full_name}</Link>
                  <br/><span className="text-xs text-[#64748b] font-normal">{t.email}</span>
                </td>
                <td className="px-4 py-3 text-[#64748b]">{t.subject}</td>
                <td className="px-4 py-3 text-right font-mono text-xs">{formatNaira(t.rate_per_period)}</td>
                <td className="px-4 py-3 text-right">
                  <Link to={`/admin/teachers/${t.id}`} className="text-xs font-semibold text-[#1a5f7a] mr-3">View</Link>
                  <button onClick={() => openEdit(t)} className="p-1.5 bg-[#e0f2fe] text-[#0369a1] rounded-lg mr-2"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(t.id)} className="p-1.5 bg-[#fee2e2] text-[#b91c1c] rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Teacher' : 'Add Teacher'}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold mb-1 dark:text-[#a0aec0]">Full Name</label>
            <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 rounded-lg border dark:border-[#2f3e52] dark:bg-[#0d1b2a] dark:text-white text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 dark:text-[#a0aec0]">Email</label>
            <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2 rounded-lg border dark:border-[#2f3e52] dark:bg-[#0d1b2a] dark:text-white text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 dark:text-[#a0aec0]">Subject</label>
            <input required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="w-full px-3 py-2 rounded-lg border dark:border-[#2f3e52] dark:bg-[#0d1b2a] dark:text-white text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 dark:text-[#a0aec0]">Rate per Period (₦)</label>
            <input required type="number" value={form.rate} onChange={e => setForm(f => ({ ...f, rate: e.target.value }))} className="w-full px-3 py-2 rounded-lg border dark:border-[#2f3e52] dark:bg-[#0d1b2a] dark:text-white text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 dark:text-[#a0aec0]">PIN {editingId && '(Leave blank to keep current)'}</label>
            <input type="password" required={!editingId} maxLength={6} value={form.pin} onChange={e => setForm(f => ({ ...f, pin: e.target.value.replace(/\D/g, '') }))} className="w-full px-3 py-2 rounded-lg border dark:border-[#2f3e52] dark:bg-[#0d1b2a] dark:text-white text-sm" />
          </div>
          <button type="submit" disabled={saving} className="w-full py-3 mt-2 rounded-lg bg-[#0f2b3d] text-white text-sm font-semibold">{saving ? 'Saving...' : 'Save Teacher'}</button>
        </form>
      </Modal>
    </div>
  )
}