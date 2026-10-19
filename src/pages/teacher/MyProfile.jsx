import { useState, useEffect } from 'react'
import { Loader2, Mail, BookOpen, Wallet } from 'lucide-react'
import { apiRequest } from '../../lib/api'
import { formatNaira, formatDate } from '../../lib/format'

export default function TeacherMyProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await apiRequest('/teacher-portal/profile')
        setProfile(data)
      } catch (err) { console.error(err) } 
      finally { setLoading(false) }
    }
    load()
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#00b4d8]" /></div>
  if (!profile) return <div className="p-8 text-center text-red-500">Profile not found</div>

  return (
    <div className="space-y-5 animate-fade-in-up max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[#0f2b3d] dark:text-white">My Profile</h1>
        <p className="text-sm text-[#64748b] dark:text-[#a0aec0] mt-1">Your personal information</p>
      </div>

      <div className="glass-card rounded-xl p-5 flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-[#0f2b3d] flex items-center justify-center text-3xl font-black text-white mb-4">
          {profile.full_name.slice(0, 2).toUpperCase()}
        </div>
        <h2 className="text-xl font-bold text-[#0f2b3d] dark:text-white">{profile.full_name}</h2>
        <p className="text-sm text-[#64748b]">{profile.subject} Teacher</p>
        
        <div className="grid grid-cols-2 gap-4 w-full mt-6 text-left">
          <div className="p-3 bg-[#f4f3f5] dark:bg-[#0d1b2a] rounded-lg">
            <p className="text-[10px] font-bold text-[#64748b] uppercase mb-1">Email</p>
            <p className="text-sm font-semibold dark:text-white truncate">{profile.email}</p>
          </div>
          <div className="p-3 bg-[#f4f3f5] dark:bg-[#0d1b2a] rounded-lg">
            <p className="text-[10px] font-bold text-[#64748b] uppercase mb-1">Rate / Period</p>
            <p className="text-sm font-semibold dark:text-white">{formatNaira(profile.rate_per_period)}</p>
          </div>
          <div className="p-3 bg-[#f4f3f5] dark:bg-[#0d1b2a] rounded-lg">
            <p className="text-[10px] font-bold text-[#64748b] uppercase mb-1">Date Joined</p>
            <p className="text-sm font-semibold dark:text-white">{formatDate(profile.date_joined)}</p>
          </div>
          <div className="p-3 bg-[#f4f3f5] dark:bg-[#0d1b2a] rounded-lg">
            <p className="text-[10px] font-bold text-[#64748b] uppercase mb-1">Status</p>
            <p className="text-sm font-semibold text-[#2d9b4e]">Active</p>
          </div>
        </div>
      </div>
    </div>
  )
}