import { useState } from 'react'
import { X, Clock, CheckCircle } from 'lucide-react'
import { formatNaira } from '../../lib/format'

export default function SignInModal({ open, onClose, person, kind = 'student', onConfirm }) {
  const [mode, setMode] = useState('in') // 'in' | 'out'
  const [periods, setPeriods] = useState(1)

  if (!open || !person) return null

  function handleConfirm() {
    onConfirm({
      kind,
      person,
      mode,
      periods: kind === 'teacher' && mode === 'in' ? periods : undefined,
    })
    setPeriods(1)
    setMode('in')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full lg:max-w-md bg-white dark:bg-portal-card-dark rounded-t-2xl lg:rounded-2xl shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto">
        {/* Drag handle (mobile) */}
        <div className="lg:hidden flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-portal-border dark:bg-white/20" />
        </div>

        <div className="flex items-center justify-between p-5 border-b border-portal-border dark:border-portal-border-dark">
          <h3 className="text-lg font-bold text-portal-navy dark:text-white">
            {mode === 'in' ? 'Sign In' : 'Sign Out'}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5">
            <X className="w-5 h-5 text-portal-muted" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Person summary */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-portal-surface dark:bg-portal-surface-dark">
            <div className="w-12 h-12 rounded-full bg-portal-navy flex items-center justify-center text-white font-bold shrink-0">
              {person.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-portal-navy dark:text-white truncate">{person.name}</p>
              <p className="text-xs text-portal-muted truncate">{person.matric || person.subject || person.email}</p>
            </div>
          </div>

          {/* Mode toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setMode('in')}
              className={`py-3 rounded-lg text-sm font-semibold transition ${mode === 'in' ? 'bg-portal-success text-white' : 'bg-slate-100 dark:bg-white/5 text-portal-muted'}`}>
              Sign In
            </button>
            <button onClick={() => setMode('out')}
              className={`py-3 rounded-lg text-sm font-semibold transition ${mode === 'out' ? 'bg-portal-danger text-white' : 'bg-slate-100 dark:bg-white/5 text-portal-muted'}`}>
              Sign Out
            </button>
          </div>

          {/* Period selector for teachers signing in */}
          {kind === 'teacher' && mode === 'in' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-portal-muted mb-2">
                How many periods today?
              </label>
              <div className="flex items-center gap-2">
                <button onClick={() => setPeriods(Math.max(1, periods - 1))}
                  className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-white/5 text-xl font-bold text-portal-navy dark:text-white active:scale-95">
                  −
                </button>
                <input type="number" min="1" max="12" value={periods}
                  onChange={e => setPeriods(Math.max(1, Math.min(12, parseInt(e.target.value) || 1)))}
                  className="flex-1 h-12 text-center text-2xl font-black rounded-lg border border-portal-border dark:border-portal-border-dark bg-white dark:bg-portal-surface-dark text-portal-navy dark:text-white"
                />
                <button onClick={() => setPeriods(Math.min(12, periods + 1))}
                  className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-white/5 text-xl font-bold text-portal-navy dark:text-white active:scale-95">
                  +
                </button>
              </div>
              <div className="mt-2 p-3 rounded-lg bg-portal-success/10 flex items-center justify-between">
                <span className="text-xs font-semibold text-portal-muted">Pay for this session</span>
                <span className="font-black text-portal-success">{formatNaira(periods * 2000)}</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-portal-muted">
            <Clock className="w-4 h-4" />
            Time will be recorded automatically
          </div>
        </div>

        <div className="p-5 pt-0 flex gap-2">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-lg border border-portal-border dark:border-portal-border-dark text-sm font-semibold">
            Cancel
          </button>
          <button onClick={handleConfirm}
            className={`flex-1 py-3 rounded-lg text-white text-sm font-semibold flex items-center justify-center gap-2 ${mode === 'in' ? 'bg-portal-success' : 'bg-portal-danger'}`}>
            <CheckCircle className="w-4 h-4" /> Confirm
          </button>
        </div>
      </div>
    </div>
  )
}