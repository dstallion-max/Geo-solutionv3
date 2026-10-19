const VARIANTS = {
  success: 'bg-portal-success/10 text-portal-success',
  warning: 'bg-portal-warning/10 text-portal-warning',
  danger: 'bg-portal-danger/10 text-portal-danger',
  info: 'bg-portal-navy-light/10 text-portal-navy-light',
  neutral: 'bg-slate-100 dark:bg-white/5 text-portal-muted dark:text-portal-muted-dark',
}

export default function Badge({ children, variant = 'neutral', dot = false }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${VARIANTS[variant]}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}