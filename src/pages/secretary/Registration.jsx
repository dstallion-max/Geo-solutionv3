import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Users, Calendar, Upload, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { apiRequest } from '../../lib/api'

export default function Registration() {
  const navigate = useNavigate()
  const [type, setType] = useState('exam')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '', gender: '', dob: '', phone: '', email: '', address: '',
    department: 'Science', examType: 'JAMB', course: 'Web Development', level: 'Beginner',
    startDate: new Date().toISOString().slice(0, 10), durationMonths: 12,
    parentName: '', parentRel: '', parentPhone: '', parentWA: '', parentEmail: '', parentOcc: '', parentAddr: '',
  })
  
  const [photo, setPhoto] = useState(null)
  const [doc, setDoc] = useState(null)

  const endDate = (() => {
    const d = new Date(form.startDate)
    d.setMonth(d.getMonth() + form.durationMonths)
    return d.toISOString().slice(0, 10)
  })()

  async function submit(e) {
    e.preventDefault()
    setError('')

    // Client-side file size validation (5MB)
    const MAX_SIZE = 5 * 1024 * 1024
    if (photo && photo.size > MAX_SIZE) {
      setError('Passport photo is too large. Maximum size is 5MB.')
      return
    }
    if (doc && doc.size > MAX_SIZE) {
      setError('Signed form is too large. Maximum size is 5MB.')
      return
    }

    setLoading(true)

    try {
      const fd = new FormData()
      
      fd.append('full_name', form.name)
      fd.append('gender', form.gender)
      fd.append('dob', form.dob)
      fd.append('phone', form.phone)
      fd.append('email', form.email)
      fd.append('address', form.address)
      fd.append('student_type', type)
      fd.append('start_date', form.startDate)
      fd.append('end_date', endDate)
      
      if (type === 'exam') {
        fd.append('course_dept', form.department)
        fd.append('level', form.examType)
      } else {
        fd.append('course_dept', form.course)
        fd.append('level', form.level)
      }

      fd.append('parent_name', form.parentName)
      fd.append('parent_relationship', form.parentRel)
      fd.append('parent_phone_call', form.parentPhone)
      fd.append('parent_phone_whatsapp', form.parentWA)
      fd.append('parent_email', form.parentEmail)
      fd.append('parent_occupation', form.parentOcc)
      fd.append('parent_address', form.parentAddr)

      if (photo) fd.append('photo', photo)
      if (doc) fd.append('form', doc)

      await apiRequest('/students/register', {
        method: 'POST',
        body: fd,
      })

      navigate('/secretary/students') 
      
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5 animate-fade-in-up max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0f2b3d] dark:text-white">Register Student</h1>
        <p className="text-sm text-[#64748b] dark:text-[#a0aec0] mt-1">New enrollment</p>
      </div>

      {/* Error Message Area */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-[#e63946]/10 text-[#e63946] text-sm font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        {/* Type toggle */}
        <div className="glass-card rounded-xl p-3">
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#efedef] dark:bg-[#0d1b2a] rounded-lg">
            <button type="button" onClick={() => setType('exam')} 
              className={`py-2.5 rounded-md text-sm font-semibold transition ${type === 'exam' ? 'bg-white dark:bg-[#2f3e52] text-[#0f2b3d] dark:text-white shadow' : 'text-[#73777d] dark:text-[#a0aec0]'}`}>
              Exam
            </button>
            <button type="button" onClick={() => setType('training')} 
              className={`py-2.5 rounded-md text-sm font-semibold transition ${type === 'training' ? 'bg-white dark:bg-[#2f3e52] text-[#0f2b3d] dark:text-white shadow' : 'text-[#73777d] dark:text-[#a0aec0]'}`}>
              Computer Training
            </button>
          </div>
        </div>

        {/* Personal */}
        <Section title="Personal Information" icon={User}>
          <div className="grid sm:grid-cols-2 gap-3">
            <Input label="Full Name *" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} required />
            <Select label="Gender *" value={form.gender} onChange={v => setForm(f => ({ ...f, gender: v }))} options={[{ v: '', l: 'Select gender' }, { v: 'Male', l: 'Male' }, { v: 'Female', l: 'Female' }, { v: 'Other', l: 'Other' }]} required />
            <Input label="Date of Birth *" type="date" value={form.dob} onChange={v => setForm(f => ({ ...f, dob: v }))} required />
            <Input label="Phone *" type="tel" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} required />
            <Input label="Email" type="email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} />
            <div className="sm:col-span-2"><Input label="Address *" value={form.address} onChange={v => setForm(f => ({ ...f, address: v }))} required /></div>
          </div>
        </Section>

        {/* Academic */}
        <Section title={type === 'exam' ? 'Exam Details' : 'Training Details'} icon={Users}>
          <div className="grid sm:grid-cols-2 gap-3">
            {type === 'exam' ? (
              <>
                <Select label="Department *" value={form.department} onChange={v => setForm(f => ({ ...f, department: v }))} options={['Science', 'Art', 'Commercial'].map(x => ({ v: x, l: x }))} required />
                <Select label="Exam Type *" value={form.examType} onChange={v => setForm(f => ({ ...f, examType: v }))} options={['JAMB', 'WAEC', 'NECO', 'SPECIAL'].map(x => ({ v: x, l: x }))} required />
              </>
            ) : (
              <>
                <Select label="Course *" value={form.course} onChange={v => setForm(f => ({ ...f, course: v }))} options={['Web Development', 'Graphics Design', 'Computer Fundamentals', 'Data Analysis'].map(x => ({ v: x, l: x }))} required />
                <Select label="Level *" value={form.level} onChange={v => setForm(f => ({ ...f, level: v }))} options={['Beginner', 'Intermediate', 'Advanced'].map(x => ({ v: x, l: x }))} required />
              </>
            )}
          </div>
        </Section>

        {/* Duration */}
        <Section title="Enrollment Duration" icon={Calendar}>
          <div className="grid sm:grid-cols-2 gap-3">
            <Input label="Start Date *" type="date" value={form.startDate} onChange={v => setForm(f => ({ ...f, startDate: v }))} required />
            <div>
              <label className="block text-xs font-semibold text-[#64748b] dark:text-[#a0aec0] mb-1">Duration *</label>
              <div className="grid grid-cols-5 gap-1.5">
                {[3, 6, 12, 18, 24].map(m => (
                  <button key={m} type="button" onClick={() => setForm(f => ({ ...f, durationMonths: m }))}
                    className={`py-2.5 rounded-lg text-xs font-semibold transition ${form.durationMonths === m ? 'bg-[#0f2b3d] dark:bg-[#00b4d8] text-white' : 'bg-[#efedef] dark:bg-[#0d1b2a] text-[#64748b] dark:text-[#a0aec0]'}`}>{m}mo</button>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2 p-3 rounded-lg bg-[#00b4d8]/10 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748b] dark:text-[#a0aec0] flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Auto end date</span>
              <span className="font-bold text-[#0f2b3d] dark:text-white">{new Date(endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        </Section>

        {/* Parent */}
        <Section title="Parent / Guardian" icon={Users}>
          <div className="grid sm:grid-cols-2 gap-3">
            <Input label="Parent Name *" value={form.parentName} onChange={v => setForm(f => ({ ...f, parentName: v }))} required />
            <Select label="Relationship *" value={form.parentRel} onChange={v => setForm(f => ({ ...f, parentRel: v }))} options={[{ v: '', l: 'Select' }, { v: 'Father', l: 'Father' }, { v: 'Mother', l: 'Mother' }, { v: 'Guardian', l: 'Guardian' }]} required />
            <Input label="Phone (Call) *" type="tel" value={form.parentPhone} onChange={v => setForm(f => ({ ...f, parentPhone: v }))} required />
            <Input label="Phone (WhatsApp) *" type="tel" value={form.parentWA} onChange={v => setForm(f => ({ ...f, parentWA: v }))} required />
            <Input label="Email" type="email" value={form.parentEmail} onChange={v => setForm(f => ({ ...f, parentEmail: v }))} />
            <Input label="Occupation *" value={form.parentOcc} onChange={v => setForm(f => ({ ...f, parentOcc: v }))} required />
            <div className="sm:col-span-2"><Input label="Address *" value={form.parentAddr} onChange={v => setForm(f => ({ ...f, parentAddr: v }))} required /></div>
          </div>
        </Section>

        {/* Uploads */}
        <Section title="Uploads" icon={Upload}>
          <div className="grid sm:grid-cols-2 gap-3">
            <FileInput label="Passport Photo" file={photo} onChange={setPhoto} accept="image/*" hint="JPG, PNG (max 5MB)" />
            <FileInput label="Signed Form" file={doc} onChange={setDoc} accept="image/*,.pdf" hint="PDF or Image (max 5MB)" />
          </div>
        </Section>

        <button type="submit" disabled={loading} className="w-full py-3.5 rounded-lg bg-[#0f2b3d] hover:bg-[#1a5f7a] text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
          {loading ? 'Registering...' : 'Register Student'}
        </button>
      </form>
    </div>
  )
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="glass-card rounded-xl p-4 sm:p-5">
      <h3 className="text-sm font-bold text-[#0f2b3d] dark:text-white flex items-center gap-2 mb-3 pb-2 border-b border-[#c3c7cc]/20 dark:border-[#2f3e52]">
        <Icon className="w-4 h-4" /> {title}
      </h3>
      {children}
    </div>
  )
}

function Input({ label, value, onChange, type = 'text', required }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#64748b] dark:text-[#a0aec0] mb-1">{label}</label>
      <input type={type} required={required} value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-lg border border-[#c3c7cc]/40 dark:border-[#2f3e52] bg-white dark:bg-[#0d1b2a] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/30" />
    </div>
  )
}

function Select({ label, value, onChange, options, required }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#64748b] dark:text-[#a0aec0] mb-1">{label}</label>
      <select required={required} value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-lg border border-[#c3c7cc]/40 dark:border-[#2f3e52] bg-white dark:bg-[#0d1b2a] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/30">
        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  )
}

function FileInput({ label, file, onChange, accept, hint }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#64748b] dark:text-[#a0aec0] mb-1">{label}</label>
      <label className="flex items-center gap-2 p-3 rounded-lg border-2 border-dashed border-[#c3c7cc]/40 dark:border-[#2f3e52] cursor-pointer hover:border-[#00b4d8] transition bg-[#faf9fa] dark:bg-[#0d1b2a]">
        <Upload className="w-4 h-4 text-[#73777d] dark:text-[#a0aec0] shrink-0" />
        <span className="text-xs text-[#64748b] dark:text-[#a0aec0] truncate">{file?.name || hint}</span>
        <input type="file" accept={accept} className="hidden" onChange={e => onChange(e.target.files[0])} />
      </label>
    </div>
  )
}