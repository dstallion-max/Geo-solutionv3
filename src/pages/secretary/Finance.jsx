import { useState, useEffect, useMemo } from 'react'
import { TrendingUp, TrendingDown, Wallet, Trash2, Plus, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatNaira, formatDate } from '../../lib/format'
import { apiRequest } from '../../lib/api'
import Modal from '../../components/ui/Modal'

export default function SecretaryFinance() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10))
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10))
  const [typeFilter, setTypeFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchTransactions()
  }, [])

  async function fetchTransactions() {
    try {
      const data = await apiRequest('/finance')
      setRows(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    return rows.filter(t => {
      const dateOk = t.date >= startDate && t.date <= endDate
      const typeOk = typeFilter === 'all' || t.type === typeFilter
      const q = search.toLowerCase()
      const searchOk = !q || (t.description || '').toLowerCase().includes(q) || (t.customer_name || '').toLowerCase().includes(q) || (t.category || '').toLowerCase().includes(q)
      return dateOk && typeOk && searchOk
    })
  }, [rows, startDate, endDate, typeFilter, search])

  const income = filtered.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
  const expense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
  const netProfitLoss = income - expense
  
  // v2 Logic: Total Profit ONLY sums positive differences for income with actual_cost
  const totalProfit = filtered
    .filter(t => t.type === 'income' && t.actual_cost != null)
    .reduce((s, t) => {
      const diff = Number(t.amount) - Number(t.actual_cost)
      return diff > 0 ? s + diff : s
    }, 0)

  async function confirmDelete() {
    setDeleting(true)
    try {
      await apiRequest(`/finance/${deleteTarget}`, { method: 'DELETE' })
      setRows(prev => prev.filter(r => r.id !== deleteTarget))
      setDeleteTarget(null)
    } catch (err) {
      alert(err.message)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#00b4d8]" /></div>

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0f2b3d] dark:text-white">Finance</h1>
          <p className="text-sm text-[#64748b] dark:text-[#a0aec0] mt-1">Income, expenses, profit and loss</p>
        </div>
        <div className="flex gap-2">
          <Link to="/secretary/finance-entry" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0f2b3d] hover:bg-[#1a5f7a] text-white text-sm font-semibold">
            <Plus className="w-4 h-4" /> New Entry
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={TrendingUp} label="Income" value={formatNaira(income)} color="success" />
        <StatCard icon={TrendingDown} label="Expenses" value={formatNaira(expense)} color="danger" />
        <StatCard icon={Wallet} label="Net Profit/Loss" value={formatNaira(netProfitLoss)} color={netProfitLoss >= 0 ? 'navy' : 'danger'} />
        <StatCard icon={TrendingUp} label="Total Profit" value={formatNaira(totalProfit)} color="cyan" />
      </div>

      <div className="glass-card rounded-xl p-3">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <div>
            <label className="block text-[10px] font-semibold uppercase text-[#64748b] dark:text-[#a0aec0] mb-1">From</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#c3c7cc]/30 dark:border-[#2f3e52] bg-white dark:bg-[#0d1b2a] dark:text-white text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase text-[#64748b] dark:text-[#a0aec0] mb-1">To</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#c3c7cc]/30 dark:border-[#2f3e52] bg-white dark:bg-[#0d1b2a] dark:text-white text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase text-[#64748b] dark:text-[#a0aec0] mb-1">Type</label>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#c3c7cc]/30 dark:border-[#2f3e52] bg-white dark:bg-[#0d1b2a] dark:text-white text-sm">
              <option value="all">All Types</option>
              <option value="income">Income only</option>
              <option value="expense">Expense only</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase text-[#64748b] dark:text-[#a0aec0] mb-1">Search</label>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Description, customer…"
              className="w-full px-3 py-2 rounded-lg border border-[#c3c7cc]/30 dark:border-[#2f3e52] bg-white dark:bg-[#0d1b2a] dark:text-white text-sm" />
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#c3c7cc]/20 dark:border-[#2f3e52]">
          <h3 className="text-sm font-semibold text-[#0f2b3d] dark:text-white">Transactions ({filtered.length})</h3>
        </div>

        <div className="lg:hidden divide-y divide-[#c3c7cc]/10 dark:divide-[#2f3e52]">
          {filtered.map(t => {
            const diff = t.type === 'income' && t.actual_cost != null ? t.amount - t.actual_cost : null
            return (
              <div key={t.id} className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#0f2b3d] dark:text-white truncate">{t.category}</p>
                    <p className="text-xs text-[#64748b] dark:text-[#a0aec0] truncate">{t.description}</p>
                  </div>
                  <span className={`font-bold whitespace-nowrap text-sm ${t.type === 'income' ? 'text-[#2d9b4e]' : 'text-[#e63946]'}`}>
                    {t.type === 'income' ? '+' : '−'}{formatNaira(t.amount)}
                  </span>
                </div>
                {diff !== null && (
                   <div className={`text-xs font-semibold mb-2 ${diff >= 0 ? 'text-[#2d9b4e]' : 'text-[#e63946]'}`}>
                     {diff >= 0 ? 'Profit' : 'Loss'} {formatNaira(Math.abs(diff))}
                   </div>
                )}
                <div className="flex gap-2 mt-2">
                  <button onClick={() => setDeleteTarget(t.id)} className="flex-1 py-1.5 rounded-lg bg-[#fee2e2] dark:bg-[#e63946]/20 text-[#b91c1c] dark:text-[#e63946] text-xs font-semibold">Delete</button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#0f2b3d] text-white">
              <tr>
                <th className="px-4 py-3 text-left text-[10px] uppercase font-semibold">Date</th>
                <th className="px-4 py-3 text-left text-[10px] uppercase font-semibold">Category</th>
                <th className="px-4 py-3 text-left text-[10px] uppercase font-semibold">Description</th>
                <th className="px-4 py-3 text-right text-[10px] uppercase font-semibold">Amount</th>
                <th className="px-4 py-3 text-right text-[10px] uppercase font-semibold">Actual Cost</th>
                <th className="px-4 py-3 text-right text-[10px] uppercase font-semibold">Profit/Loss</th>
                <th className="px-4 py-3 text-right text-[10px] uppercase font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => {
                const diff = t.type === 'income' && t.actual_cost != null ? t.amount - t.actual_cost : null
                return (
                  <tr key={t.id} className="border-b border-[#c3c7cc]/10 dark:border-[#2f3e52]">
                    <td className="px-4 py-3 text-xs text-[#64748b] dark:text-[#a0aec0]">{formatDate(t.date)}</td>
                    <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${t.type === 'income' ? 'bg-[#2d9b4e]/12 text-[#2d9b4e]' : 'bg-[#e63946]/12 text-[#e63946]'}`}>{t.category}</span></td>
                    <td className="px-4 py-3 text-[#0f2b3d] dark:text-white">{t.description}</td>
                    <td className={`px-4 py-3 text-right font-bold ${t.type === 'income' ? 'text-[#2d9b4e]' : 'text-[#e63946]'}`}>{t.type === 'income' ? '+' : '−'}{formatNaira(t.amount)}</td>
                    <td className="px-4 py-3 text-right text-xs text-[#64748b] dark:text-[#a0aec0]">{t.actual_cost != null ? formatNaira(t.actual_cost) : '—'}</td>
                    <td className="px-4 py-3 text-right text-xs font-semibold">
                      {diff !== null ? (
                        <span className={diff >= 0 ? 'text-[#2d9b4e]' : 'text-[#e63946]'}>
                          {diff >= 0 ? '+' : '−'}{formatNaira(Math.abs(diff))}
                        </span>
                      ) : (
                        <span className="text-[#94a3b8]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setDeleteTarget(t.id)} className="p-1.5 rounded-lg bg-[#fee2e2] text-[#b91c1c]"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Transaction"
        size="sm"
        footer={
          <>
            <button onClick={() => setDeleteTarget(null)} className="flex-1 py-3 rounded-lg border text-sm font-semibold">Cancel</button>
            <button onClick={confirmDelete} disabled={deleting} className="flex-1 py-3 rounded-lg bg-[#e63946] text-white text-sm font-semibold disabled:opacity-50">
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </>
        }
      >
        <p className="text-sm text-[#64748b]">Are you sure? This cannot be undone.</p>
      </Modal>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }) {
  const map = { navy: 'border-[#0f2b3d] text-[#0f2b3d]', success: 'border-[#2d9b4e] text-[#2d9b4e]', danger: 'border-[#e63946] text-[#e63946]', cyan: 'border-[#00b4d8] text-[#00b4d8]' }
  return (
    <div className={`glass-card rounded-xl p-3 border-l-4 ${map[color]}`}>
      <Icon className="w-4 h-4 mb-1" />
      <p className="text-base font-bold text-[#0f2b3d] dark:text-white break-words">{value}</p>
      <p className="text-[10px] font-semibold uppercase text-[#64748b] dark:text-[#a0aec0] mt-0.5">{label}</p>
    </div>
  )
}