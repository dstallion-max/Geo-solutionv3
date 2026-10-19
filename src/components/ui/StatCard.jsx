export default function StatCard({ icon: Icon, label, value, trend, accent = 'navy' }) {
  const accents = {
    navy: 'border-portal-navy text-portal-navy',
    success: 'border-portal-success text-portal-success',
    warning: 'border-portal-warning text-portal-warning',
    danger: 'border-portal-danger text-portal-danger',
    cyan: 'border-portal-cyan text-portal-cyan',
  }

  return (
    <div className={`bg-white dark:bg-portal-card-dark rounded-xl border border-portal-border dark:border-portal-border-dark shadow-sm p-4 border-l-4 ${accents[accent]}`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-6 h-6" />
        {trend && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5">{trend}</span>}
      </div>
      <p className="text-2xl font-black text-portal-navy dark:text-white">{value}</p>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-portal-muted dark:text-portal-muted-dark mt-0.5">{label}</p>
    </div>
  )
}