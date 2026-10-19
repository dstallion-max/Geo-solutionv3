import { useState } from 'react'
import { Save, Bell, User } from 'lucide-react'

export default function SecretarySettings() {
  const [profile, setProfile] = useState({ name: 'Secretary', email: 'secretary@geo.com' })
  const [notifications, setNotifications] = useState({ dailyDigest: true, expiring: true })

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0f2b3d] dark:text-white">Settings</h1>
        <p className="text-sm text-[#64748b] dark:text-[#a0aec0] mt-1">Manage your profile and preferences</p>
      </div>

      <div className="glass-card rounded-xl p-4 sm:p-5">
        <h3 className="text-sm font-bold text-[#0f2b3d] dark:text-white flex items-center gap-2 mb-3 pb-2 border-b border-[#c3c7cc]/20 dark:border-[#2f3e52]">
          <User className="w-4 h-4" /> My Profile
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#64748b] dark:text-[#a0aec0] mb-1">Name</label>
            <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#64748b] dark:text-[#a0aec0] mb-1">Email</label>
            <input type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-4 sm:p-5">
        <h3 className="text-sm font-bold text-[#0f2b3d] dark:text-white flex items-center gap-2 mb-3 pb-2 border-b border-[#c3c7cc]/20 dark:border-[#2f3e52]">
          <Bell className="w-4 h-4" /> Notifications
        </h3>
        <div className="space-y-2">
          {[
            { key: 'dailyDigest', label: 'Daily digest', desc: 'Daily summary email' },
            { key: 'expiring', label: 'Student expiring soon', desc: 'Alert before expiry' },
          ].map(item => (
            <label key={item.key} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f4f3f5] dark:hover:bg-[#0d1b2a] cursor-pointer">
              <div>
                <p className="text-sm font-semibold text-[#0f2b3d] dark:text-white">{item.label}</p>
                <p className="text-[11px] text-[#64748b] dark:text-[#a0aec0]">{item.desc}</p>
              </div>
              <input type="checkbox" checked={notifications[item.key]} onChange={e => setNotifications(n => ({ ...n, [item.key]: e.target.checked }))}
                className="w-5 h-5 accent-[#0f2b3d] dark:accent-[#00b4d8]" />
            </label>
          ))}
        </div>
      </div>

      <button onClick={() => alert('Settings saved (demo).')}
        className="w-full py-3 rounded-lg bg-[#0f2b3d] hover:bg-[#1a5f7a] dark:bg-[#00b4d8] text-white text-sm font-bold flex items-center justify-center gap-2">
        <Save className="w-4 h-4" /> Save Settings
      </button>
    </div>
  )
}