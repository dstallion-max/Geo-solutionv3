import { useState, useEffect, useMemo } from 'react'
import { TrendingUp, TrendingDown, Wallet, Trash2, Loader2, Search, Pencil } from 'lucide-react'
import { formatNaira, formatDate } from '../../lib/format'
import { apiRequest } from '../../lib/api'
import Modal from '../../components/ui/Modal'

const CATEGORIES = {
  income: ['Training Fees', 'Exam Fees', 'Consultation', 'Other Income'],
  expense: ['Salaries', 'Utilities', 'Supplies', 'Maintenance', 'Rent', 'Miscellaneous'],
}

export default function AdminFinance() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Edit State
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [savingEdit, setSavingEdit] = useState(false)
  const [editForm, setEditForm] = useState({})

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

  function openEdit(t) {
    setEditingId(t.id)
    setEditForm({
      type: t.type,
      category: t.category,
      customer_name: t.customer_name || '',
      amount: t.amount,
      actual_cost: t.actual_cost || '',
      method: t.method,
      description: t.description,
      date: t.date
    })
    setEditModalOpen(true)
  }

  async function handleUpdate(e) {
    e.preventDefault()
    setSavingEdit(true)
    try {
      await apiRequest(`/finance/${editingId}`, {
        method: 'PUT',
        body: editForm
      })
      setEditModalOpen(false)
      fetchTransactions()
    } catch (err) {
      alert(err.message)
    } finally {
      setSavingEdit(false)
    }
  }

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

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return rows
    return rows.filter(t => 
      (t.description || '').toLowerCase().includes(q) || 
      (t.customer_name || '').toLowerCase().includes(q) || 
      (t.category || '').toLowerCase().includes(q)
    )
  }, [rows, search])

  const income = filtered.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
  const expense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
  const netProfitLoss = income - expense
  const totalProfit = filtered
    .filter(t => t.type === 'income' && t.actual_cost != null)
    .reduce((s, t) => s + Math.max(0, t.amount - t.actual_cost), 0)

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#00b4d8]" /></div>

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0f2b3d] dark:text-white">Company Finance</h1>
        <p className="text-sm text-[#64748b] dark:text-[#a0aec0] mt-1">View and edit all income and expenses</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={TrendingUp} label="Total Income" value={formatNaira(income)} color="success" />
        <StatCard icon={TrendingDown} label="Total Expenses" value={formatNaira(expense)} color="danger" />
        <StatCard icon={Wallet} label="Net Profit/Loss" value={formatNaira(netProfitLoss)} color={netProfitLoss >= 0 ? 'navy' : 'danger'} />
        <StatCard icon={TrendingUp} label="Total Profit" value={formatNaira(totalProfit)} color="cyan" />
      </div>

      <div className="glass-card rounded-xl p-3">
        <div className="flex items-center w-full px-3.5 py-2.5 rounded-lg border border-[#c3c7cc]/30 dark:border-[#2f3e52] bg-white/50 dark:bg-[#0d1b2a]">
          <Search className="w-4 h-4 text-[#73777d] shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search transactions..." className="flex-1 bg-transparent border-none outline-none text-sm pl-2 dark:text-white" />
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#c3c7cc]/20 dark:border-[#2f3e52]">
          <h3 className="text-sm font-semibold text-[#0f2b3d] dark:text-white">All Transactions ({filtered.length})</h3>
        </div>

        <div className="lg:hidden divide-y divide-[#c3c7cc]/10 dark:divide-[#2f3e52]">
          {filtered.map(t => (
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
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-[#64748b]">{formatDate(t.date)}</span>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg bg-[#e0f2fe] text-[#0369a1]"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setDeleteTarget(t.id)} className="p-1.5 rounded-lg bg-[#fee2e2] text-[#b91c1c]"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#0f2b3d] text-white">
              <tr>
                <th className="px-4 py-3 text-left text-[10px] uppercase font-semibold">Date</th>
                <th className="px-4 py-3 text-left text-[10px] uppercase font-semibold">Category</th>
                <th className="px-4 py-3 text-left text-[10px] uppercase font-semibold">Description</th>
                <th className="px-4 py-3 text-right text-[10px] uppercase font-semibold">Amount</th>
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
                    <td className="px-4 py-3 text-right text-xs font-semibold">
                      {diff !== null ? <span className={diff >= 0 ? 'text-[#2d9b4e]' : 'text-[#e63946]'}>{diff >= 0 ? '+' : '−'}{formatNaira(Math.abs(diff))}</span> : <span className="text-[#94a3b8]">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg bg-[#e0f2fe] text-[#0369a1] mr-2"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteTarget(t.id)} className="p-1.5 rounded-lg bg-[#fee2e2] text-[#b91c1c]"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Transaction">
        <form onSubmit={handleUpdate} className="space-y-3">
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#efedef] dark:bg-[#0d1b2a] rounded-lg">
            <button type="button" onClick={() => setEditForm(f => ({ ...f, type: 'income', category: '' }))}
              className={`py-2 rounded-md text-sm font-semibold ${editForm.type === 'income' ? 'bg-white dark:bg-[#1b263b] text-[#2d9b4e] shadow' : 'text-[#73777d]'}`}>Income</button>
            <button type="button" onClick={() => setEditForm(f => ({ ...f, type: 'expense', category: '' }))}
              className={`py-2 rounded-md text-sm font-semibold ${editForm.type === 'expense' ? 'bg-white dark:bg-[#1b263b] text-[#e63946] shadow' : 'text-[#73777d]'}`}>Expense</button>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 dark:text-[#a0aec0]">Category</label>
            <select required value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 rounded-lg border dark:border-[#2f3e52] dark:bg-[#0d1b2a] dark:text-white text-sm">
              <option value="">Select</option>
              {(CATEGORIES[editForm.type] || []).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {editForm.type === 'income' && (
            <div>
              <label className="block text-xs font-semibold mb-1 dark:text-[#a0aec0]">Customer</label>
              <input value={editForm.customer_name} onChange={e => setEditForm(f => ({ ...f, customer_name: e.target.value }))} className="w-full px-3 py-2 rounded-lg border dark:border-[#2f3e52] dark:bg-[#0d1b2a] dark:text-white text-sm" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold mb-1 dark:text-[#a0aec0]">Amount (₦)</label>
              <input type="number" required min="0" value={editForm.amount} onChange={e => setEditForm(f => ({ ...f, amount: e.target.value }))} className="w-full px-3 py-2 rounded-lg border dark:border-[#2f3e52] dark:bg-[#0d1b2a] dark:text-white text-sm" />
            </div>
            {editForm.type === 'income' && (
              <div>
                <label className="block text-xs font-semibold mb-1 dark:text-[#a0aec0]">Actual Cost</label>
                <input type="number" min="0" value={editForm.actual_cost} onChange={e => setEditForm(f => ({ ...f, actual_cost: e.target.value }))} className="w-full px-3 py-2 rounded-lg border dark:border-[#2f3e52] dark:bg-[#0d1b2a] dark:text-white text-sm" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 dark:text-[#a0aec0]">Date</label>
            <input type="date" required value={editForm.date} onChange={e => setEditForm(f => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2 rounded-lg border dark:border-[#2f3e52] dark:bg-[#0d1b2a] dark:text-white text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 dark:text-[#a0aec0]">Description</label>
            <input value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 rounded-lg border dark:border-[#2f3e52] dark:bg-[#0d1b2a] dark:text-white text-sm" />
          </div>

          <button type="submit" disabled={savingEdit} className="w-full py-3 mt-2 rounded-lg bg-[#0f2b3d] text-white text-sm font-semibold">
            {savingEdit ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Transaction" size="sm" footer={
        <>
          <button onClick={() => setDeleteTarget(null)} className="flex-1 py-3 rounded-lg border text-sm font-semibold">Cancel</button>
          <button onClick={confirmDelete} disabled={deleting} className="flex-1 py-3 rounded-lg bg-[#e63946] text-white text-sm font-semibold disabled:opacity-50">
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </>
      }>
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