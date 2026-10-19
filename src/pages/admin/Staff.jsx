import { useState, useEffect } from 'react'
import { Search, Plus, Users, Shield, Loader2, Trash2, Pencil } from 'lucide-react'
import { apiRequest } from '../../lib/api'
import { formatDate } from '../../lib/format'
import Modal from '../../components/ui/Modal'

export default function AdminStaff() {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', pin: '', role: 'secretary' })

  useEffect(() => {
    fetchStaff()
  }, [])

  async function fetchStaff() {
    try {
      const data = await apiRequest('/users')
      setStaff(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function openAdd() {
    setEditingId(null)
    setForm({ name: '', email: '', pin: '', role: 'secretary' })
    setModalOpen(true)
  }

  function openEdit(user) {
    setEditingId(user.id)
    setForm({ name: user.full_name, email: user.email, pin: '', role: user.role })
    setModalOpen(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingId) {
        await apiRequest(`/users/${editingId}`, {
          method: 'PUT',
          body: { full_name: form.name, email: form.email, role: form.role, pin: form.pin || undefined }
        })
      } else {
        await apiRequest('/users/add', {
          method: 'POST',
          body: { full_name: form.name, email: form.email, role: form.role, pin: form.pin }
        })
      }
      setModalOpen(false)
      fetchStaff()
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this staff member?')) return
    try {
      await apiRequest(`/users/${id}`, { method: 'DELETE' })
      fetchStaff()
    } catch (err) { alert(err.message) }
  }

  const filtered = staff.filter(s => 
    s.full_name.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#00b4d8]" /></div>

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0f2b3d] dark:text-white">Staff</h1>
          <p className="text-sm text-[#64748b] dark:text-[#a0aec0] mt-1">{staff.length} registered</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0f2b3d] hover:bg-[#1a5f7a] text-white text-sm font-semibold">
          <Plus className="w-4 h-4" /> Add Staff
        </button>
      </div>

      <div className="glass-card rounded-xl p-3">
        <div className="flex items-center w-full px-3.5 py-2.5 rounded-lg border border-[#c3c7cc]/30 dark:border-[#2f3e52] bg-white/50 dark:bg-[#0d1b2a]">
          <Search className="w-4 h-4 text-[#73777d] shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search staff..." className="flex-1 bg-transparent border-none outline-none text-sm pl-2 dark:text-white" />
        </div>
      </div>

      <div className="lg:hidden space-y-2">
        {filtered.map(s => (
          <div key={s.id} className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#1a5f7a]/10 flex items-center justify-center">
                  {s.role === 'admin' ? <Shield className="w-4 h-4 text-[#f4a261]" /> : <Users className="w-4 h-4 text-[#00b4d8]" />}
                </div>
                <div>
                  <p className="font-semibold text-[#0f2b3d] dark:text-white">{s.full_name}</p>
                  <p className="text-xs text-[#64748b]">{s.email}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-[#c3c7cc]/20">
               <span className="font-bold uppercase text-[#64748b]">{s.role}</span>
               <div className="flex gap-2">
                 <button onClick={() => openEdit(s)} className="p-1.5 bg-[#e0f2fe] text-[#0369a1] rounded-lg"><Pencil className="w-3.5 h-3.5" /></button>
                 <button onClick={() => handleDelete(s.id)} className="p-1.5 bg-[#fee2e2] text-[#b91c1c] rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden lg:block glass-card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#0f2b3d] text-white">
            <tr>
              <th className="px-4 py-3 text-left text-[10px] uppercase font-semibold">Name</th>
              <th className="px-4 py-3 text-left text-[10px] uppercase font-semibold">Email</th>
              <th className="px-4 py-3 text-left text-[10px] uppercase font-semibold">Role</th>
              <th className="px-4 py-3 text-left text-[10px] uppercase font-semibold">Joined</th>
              <th className="px-4 py-3 text-right text-[10px] uppercase font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className="border-b border-[#c3c7cc]/10 dark:border-[#2f3e52]">
                <td className="px-4 py-3 font-semibold text-[#0f2b3d] dark:text-white">{s.full_name}</td>
                <td className="px-4 py-3 text-[#64748b]">{s.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${s.role === 'admin' ? 'bg-[#f4a261]/10 text-[#f4a261]' : 'bg-[#00b4d8]/10 text-[#00b4d8]'}`}>{s.role}</span>
                </td>
                <td className="px-4 py-3 text-xs text-[#64748b]">{formatDate(s.created_at)}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(s)} className="p-1.5 bg-[#e0f2fe] text-[#0369a1] rounded-lg mr-2"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(s.id)} className="p-1.5 bg-[#fee2e2] text-[#b91c1c] rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Staff' : 'Add Staff'}>
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
            <label className="block text-xs font-semibold mb-1 dark:text-[#a0aec0]">Role</label>
            <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="w-full px-3 py-2 rounded-lg border dark:border-[#2f3e52] dark:bg-[#0d1b2a] dark:text-white text-sm">
              <option value="secretary">Secretary</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 dark:text-[#a0aec0]">PIN {editingId && '(Leave blank to keep current)'}</label>
            <input type="password" required={!editingId} maxLength={6} value={form.pin} onChange={e => setForm(f => ({ ...f, pin: e.target.value.replace(/\D/g, '') }))} className="w-full px-3 py-2 rounded-lg border dark:border-[#2f3e52] dark:bg-[#0d1b2a] dark:text-white text-sm" />
          </div>
          <button type="submit" disabled={saving} className="w-full py-3 mt-2 rounded-lg bg-[#0f2b3d] text-white text-sm font-semibold">{saving ? 'Saving...' : 'Save Staff'}</button>
        </form>
      </Modal>
    </div>
  )
}