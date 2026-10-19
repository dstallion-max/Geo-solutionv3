import { useState, useMemo } from 'react'
import { Wallet, CheckCircle, Clock, TrendingUp, Calendar } from 'lucide-react'
import { formatNaira, formatDate } from '../../lib/format'

const MOCK_PAYMENTS = [
  { id: 1, date: '2026-10-17', periods: 3, rate: 2000, paid: false, paidAt: null },
  { id: 2, date: '2026-10-16', periods: 3, rate: 2000, paid: false, paidAt: null },
  { id: 3, date: '2026-10-15', periods: 3, rate: 2000, paid: false, paidAt: null },
  { id: 4, date: '2026-10-14', periods: 2, rate: 2000, paid: true, paidAt: '2026-10-15' },
  { id: 5, date: '2026-10-13', periods: 4, rate: 2000, paid: true, paidAt: '2026-10-15' },
  { id: 6, date: '2026-10-10', periods: 3, rate: 2000, paid: true, paidAt: '2026-10-12' },
  { id: 7, date: '2026-10-09', periods: 2, rate: 2000, paid: true, paidAt: '2026-10-12' },
  { id: 8, date: '2026-10-08', periods: 3, rate: 2000, paid: true, paidAt: '2026-10-12' },
  { id: 9, date: '2026-10-07', periods: 2, rate: 2000, paid: true, paidAt: '2026-10-08' },
  { id: 10, date: '2026-10-06', periods: 4, rate: 2000, paid: true, paidAt: '2026-10-08' },
  { id: 11, date: '2026-10-03', periods: 3, rate: 2000, paid: true, paidAt: '2026-10-05' },
  { id: 12, date: '2026-10-02', periods: 2, rate: 2000, paid: true, paidAt: '2026-10-05' },
  { id: 13, date: '2026-10-01', periods: 3, rate: 2000, paid: true, paidAt: '2026-10-05' },
]

export default function TeacherMyPayments() {
  const [month, setMonth] = useState('2026-10')
  const [status, setStatus] = useState('all')

  const filtered = useMemo(() => {
    return MOCK_PAYMENTS.filter(p => {
      const monthOk = p.date.startsWith(month)
      const statusOk = status === 'all' || (status === 'paid' && p.paid) || (status === 'pending' && !p.paid)
      return monthOk && statusOk
    })
  }, [month, status])

  const totalEarned = filtered.reduce((s, p) => s + p.periods * p.rate, 0)
  const totalPaid = filtered.filter(p => p.paid).reduce((s, p) => s + p.periods * p.rate, 0)
  const totalPending = totalEarned - totalPaid

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0f2b3d] dark:text-white">My Payments</h1>
        <p className="text-sm text-[#64748b] dark:text-[#a0aec0] mt-1">Payment history and outstanding balance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="glass-card rounded-xl p-4 border-l-4 border-[#0f2b3d]">
          <div className="flex items-center justify-between mb-1">
            <TrendingUp className="w-5 h-5 text-[#0f2b3d] dark:text-white" />
            <span className="text-[10px] font-bold text-[#0f2b3d] dark:text-white bg-[#0f2b3d]/10 dark:bg-white/10 px-2 py-0.5 rounded-full">EARNED</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#0f2b3d] dark:text-white">{formatNaira(totalEarned)}</p>
        </div>

        <div className="glass-card rounded-xl p-4 border-l-4 border-[#2d9b4e]">
          <div className="flex items-center justify-between mb-1">
            <CheckCircle className="w-5 h-5 text-[#2d9b4e]" />
            <span className="text-[10px] font-bold text-[#2d9b4e] bg-[#2d9b4e]/10 px-2 py-0.5 rounded-full">PAID</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#0f2b3d] dark:text-white">{formatNaira(totalPaid)}</p>
        </div>

        <div className="glass-card rounded-xl p-4 border-l-4 border-[#f4a261]">
          <div className="flex items-center justify-between mb-1">
            <Clock className="w-5 h-5 text-[#f4a261]" />
            <span className="text-[10px] font-bold text-[#f4a261] bg-[#f4a261]/10 px-2 py-0.5 rounded-full">PENDING</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#0f2b3d] dark:text-white">{formatNaira(totalPending)}</p>
        </div>
      </div>

      <div className="glass-card rounded-xl p-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#73777d] dark:text-[#a0aec0] shrink-0" />
            <input type="month" value={month} onChange={e => setMonth(e.target.value)}
              className="px-3 py-2 rounded-lg border border-[#c3c7cc]/30 dark:border-[#2f3e52] bg-white dark:bg-[#0d1b2a] dark:text-white text-sm w-full" />
          </div>
          <div className="flex gap-1">
            {['all', 'paid', 'pending'].map(s => (
              <button key={s} onClick={() => setStatus(s)}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold capitalize transition
                  ${status === s ? 'bg-[#0f2b3d] dark:bg-[#00b4d8] text-white' : 'bg-[#efedef] dark:bg-[#0d1b2a] text-[#64748b] dark:text-[#a0aec0]'}`}>{s}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:hidden space-y-2">
        {filtered.map(p => {
          const earned = p.periods * p.rate
          return (
            <div key={p.id} className="glass-card rounded-xl p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-semibold text-[#0f2b3d] dark:text-white">{formatDate(p.date)}</p>
                  <p className="text-xs text-[#64748b] dark:text-[#a0aec0] mt-0.5">{p.periods} periods × {formatNaira(p.rate)}</p>
                </div>
                <p className="font-bold text-[#0f2b3d] dark:text-white text-sm">{formatNaira(earned)}</p>
              </div>
              {p.paid
                ? <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#2d9b4e]/12 text-[#2d9b4e]"><CheckCircle className="w-3 h-3" /> Paid {formatDate(p.paidAt)}</span>
                : <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#f4a261]/12 text-[#f4a261]"><Clock className="w-3 h-3" /> Pending</span>}
            </div>
          )
        })}
        {filtered.length === 0 && <div className="glass-card rounded-xl p-8 text-center text-sm text-[#94a3b8]">No payments in this range.</div>}
      </div>

      <div className="hidden lg:block glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#0f2b3d] text-white">
              <tr>
                <th className="px-4 py-3 text-left text-[10px] uppercase font-semibold">Date</th>
                <th className="px-4 py-3 text-right text-[10px] uppercase font-semibold">Periods</th>
                <th className="px-4 py-3 text-right text-[10px] uppercase font-semibold">Rate</th>
                <th className="px-4 py-3 text-right text-[10px] uppercase font-semibold">Amount</th>
                <th className="px-4 py-3 text-left text-[10px] uppercase font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-[10px] uppercase font-semibold">Paid On</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const earned = p.periods * p.rate
                return (
                  <tr key={p.id} className="border-b border-[#c3c7cc]/10 dark:border-[#2f3e52] hover:bg-[#0f2b3d]/2 dark:hover:bg-white/5">
                    <td className="px-4 py-3 font-semibold text-[#0f2b3d] dark:text-white">{formatDate(p.date)}</td>
                    <td className="px-4 py-3 text-right font-semibold dark:text-white">{p.periods}</td>
                    <td className="px-4 py-3 text-right text-[#64748b] dark:text-[#a0aec0] text-xs">{formatNaira(p.rate)}</td>
                    <td className="px-4 py-3 text-right font-bold text-[#0f2b3d] dark:text-white">{formatNaira(earned)}</td>
                    <td className="px-4 py-3">
                      {p.paid
                        ? <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#2d9b4e]/12 text-[#2d9b4e]"><span className="w-1.5 h-1.5 rounded-full bg-current" />Paid</span>
                        : <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#f4a261]/12 text-[#f4a261]"><span className="w-1.5 h-1.5 rounded-full bg-current" />Pending</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#64748b] dark:text-[#a0aec0]">{p.paidAt ? formatDate(p.paidAt) : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}