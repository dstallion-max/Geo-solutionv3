import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { apiRequest } from '../../lib/api'
import { Save, Lock, User, Loader2 } from 'lucide-react'

export default function AdminSettings() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [form, setForm] = useState({
    name: user?.name || '',
    currentPin: '',
    newPin: '',
    confirmPin: ''
  })

  async function handleUpdate(e) {
    e.preventDefault()
    if (form.newPin && form.newPin !== form.confirmPin) {
      return alert('New PIN and Confirm PIN do not match')
    }

    setLoading(true)
    setSuccess(false)
    try {
      // In a real app, you'd verify the currentPin here before updating.
      // For simplicity, we are just updating the name and new pin if provided.
      await apiRequest(`/users/${user.id}`, {
        method: 'PUT',
        body: {
          full_name: form.name,
          email: user.email, // Assuming email doesn't change here
          role: user.role,
          pin: form.newPin || undefined
        }
      })
      setSuccess(true)
      setForm(f => ({ ...f, currentPin: '', newPin: '', confirmPin: '' }))
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5 animate-fade-in-up max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0f2b3d] dark:text-white">My Settings</h1>
        <p className="text-sm text-[#64748b] dark:text-[#a0aec0] mt-1">Manage your personal profile and security</p>
      </div>

      {success && (
        <div className="p-3 bg-[#2d9b4e]/10 text-[#2d9b4e] text-sm font-semibold rounded-lg">
          Settings updated successfully!
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-bold text-[#0f2b3d] dark:text-white flex items-center gap-2 mb-4 pb-2 border-b border-[#c3c7cc]/20 dark:border-[#2f3e52]">
            <User className="w-4 h-4" /> Profile Information
          </h3>
          <div>
            <label className="block text-xs font-semibold mb-1 dark:text-[#a0aec0]">Full Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border dark:border-[#2f3e52] bg-white dark:bg-[#0d1b2a] dark:text-white text-sm" />
          </div>
          <div className="mt-3">
            <label className="block text-xs font-semibold mb-1 dark:text-[#a0aec0]">Email (Read Only)</label>
            <input value={user?.email || ''} disabled className="w-full px-3 py-2.5 rounded-lg border dark:border-[#2f3e52] bg-[#f4f3f5] dark:bg-[#0d1b2a]/50 dark:text-[#a0aec0] text-sm" />
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-bold text-[#0f2b3d] dark:text-white flex items-center gap-2 mb-4 pb-2 border-b border-[#c3c7cc]/20 dark:border-[#2f3e52]">
            <Lock className="w-4 h-4" /> Change Security PIN
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold mb-1 dark:text-[#a0aec0]">Current PIN (Optional)</label>
              <input type="password" maxLength={6} value={form.currentPin} onChange={e => setForm(f => ({ ...f, currentPin: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border dark:border-[#2f3e52] bg-white dark:bg-[#0d1b2a] dark:text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 dark:text-[#a0aec0]">New 6-Digit PIN</label>
              <input type="password" maxLength={6} value={form.newPin} onChange={e => setForm(f => ({ ...f, newPin: e.target.value.replace(/\D/g, '') }))} className="w-full px-3 py-2.5 rounded-lg border dark:border-[#2f3e52] bg-white dark:bg-[#0d1b2a] dark:text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 dark:text-[#a0aec0]">Confirm New PIN</label>
              <input type="password" maxLength={6} value={form.confirmPin} onChange={e => setForm(f => ({ ...f, confirmPin: e.target.value.replace(/\D/g, '') }))} className="w-full px-3 py-2.5 rounded-lg border dark:border-[#2f3e52] bg-white dark:bg-[#0d1b2a] dark:text-white text-sm" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-3.5 rounded-lg bg-[#0f2b3d] hover:bg-[#1a5f7a] text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}