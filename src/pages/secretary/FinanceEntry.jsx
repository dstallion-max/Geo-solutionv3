import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { formatNaira } from '../../lib/format'
import { apiRequest } from '../../lib/api'

const CATEGORIES = {
  income: ['Training Fees', 'Exam Fees', 'Consultation', 'Other Income'],
  expense: ['Salaries', 'Utilities', 'Supplies', 'Maintenance', 'Rent', 'Miscellaneous'],
}

export default function FinanceEntry() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    type: 'income', category: '', customer: '', amount: '', actualCost: '',
    method: 'cash', desc: '', date: new Date().toISOString().slice(0, 10),
  })

  // v2 Logic: Calculate Profit/Loss preview
  const preview = useMemo(() => {
    const a = parseFloat(form.amount), c = parseFloat(form.actualCost)
    if (form.type !== 'income' || isNaN(a) || isNaN(c)) return null
    return a - c
  }, [form.amount, form.actualCost, form.type])

  async function submit(e) {
    e.preventDefault()
    if (!form.amount || parseFloat(form.amount) <= 0 || !form.category) return
    
    setLoading(true)
    try {
      await apiRequest('/finance', {
        method: 'POST',
        body: {
          type: form.type,
          category: form.category,
          customer_name: form.type === 'income' ? form.customer : '',
          amount: parseFloat(form.amount),
          actual_cost: form.type === 'income' && form.actualCost ? parseFloat(form.actualCost) : null,
          method: form.method,
          description: form.desc,
          date: form.date
        }
      })
      navigate('/secretary/finance')
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5 animate-fade-in-up max-w-2xl mx-auto">
      <button onClick={() => navigate('/secretary/finance')} className="inline-flex items-center gap-1 text-sm text-[#64748b] hover:text-[#0f2b3d]">
        <ArrowLeft className="w-4 h-4" /> Back to Finance
      </button>

      <div>
        <h1 className="text-2xl font-bold text-[#0f2b3d] dark:text-white">New Transaction</h1>
      </div>

      <form onSubmit={submit} className="glass-card rounded-xl p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#efedef] dark:bg-[#0d1b2a] rounded-lg">
          <button type="button" onClick={() => setForm(f => ({ ...f, type: 'income', category: '' }))}
            className={`py-2.5 rounded-md text-sm font-semibold transition ${form.type === 'income' ? 'bg-white dark:bg-[#1b263b] text-[#2d9b4e] shadow' : 'text-[#73777d]'}`}>Income</button>
          <button type="button" onClick={() => setForm(f => ({ ...f, type: 'expense', category: '' }))}
            className={`py-2.5 rounded-md text-sm font-semibold transition ${form.type === 'expense' ? 'bg-white dark:bg-[#1b263b] text-[#e63946] shadow' : 'text-[#73777d]'}`}>Expense</button>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1 dark:text-[#a0aec0]">Category *</label>
          <select required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-lg border dark:border-[#2f3e52] bg-white dark:bg-[#0d1b2a] dark:text-white text-sm">
            <option value="">Select category</option>
            {CATEGORIES[form.type].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {form.type === 'income' && (
          <div>
            <label className="block text-xs font-semibold mb-1 dark:text-[#a0aec0]">Customer Name</label>
            <input value={form.customer} onChange={e => setForm(f => ({ ...f, customer: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-lg border dark:border-[#2f3e52] bg-white dark:bg-[#0d1b2a] dark:text-white text-sm" />
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1 dark:text-[#a0aec0]">Amount (₦) *</label>
            <input type="number" required min="0" step="0.01" value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-lg border dark:border-[#2f3e52] bg-white dark:bg-[#0d1b2a] dark:text-white text-sm" />
          </div>
          
          {/* v2 Logic: Actual Cost only for Income */}
          {form.type === 'income' && (
            <div>
              <label className="block text-xs font-semibold mb-1 dark:text-[#a0aec0]">Actual Cost (₦)</label>
              <input type="number" min="0" step="0.01" value={form.actualCost}
                onChange={e => setForm(f => ({ ...f, actualCost: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg border dark:border-[#2f3e52] bg-white dark:bg-[#0d1b2a] dark:text-white text-sm" />
            </div>
          )}
          
          <div>
            <label className="block text-xs font-semibold mb-1 dark:text-[#a0aec0]">Payment Method</label>
            <select value={form.method} onChange={e => setForm(f => ({ ...f, method: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-lg border dark:border-[#2f3e52] bg-white dark:bg-[#0d1b2a] dark:text-white text-sm">
              <option value="cash">Cash</option><option value="transfer">Transfer</option><option value="cheque">Cheque</option><option value="online">Online</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 dark:text-[#a0aec0]">Date</label>
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-lg border dark:border-[#2f3e52] bg-white dark:bg-[#0d1b2a] dark:text-white text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold mb-1 dark:text-[#a0aec0]">Description</label>
            <input value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-lg border dark:border-[#2f3e52] bg-white dark:bg-[#0d1b2a] dark:text-white text-sm" />
          </div>
        </div>

        {/* v2 Logic: Live Profit/Loss Preview */}
        {preview !== null && (
          <div className={`p-3 rounded-lg text-sm font-semibold ${preview >= 0 ? 'bg-[#2d9b4e]/10 text-[#2d9b4e]' : 'bg-[#e63946]/10 text-[#e63946]'}`}>
            {preview >= 0 ? `Profit +${formatNaira(preview)}` : `Loss −${formatNaira(Math.abs(preview))}`}
          </div>
        )}

        <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-[#0f2b3d] text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {loading ? 'Saving...' : 'Save Transaction'}
        </button>
      </form>
    </div>
  )
}