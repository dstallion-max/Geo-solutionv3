export default function Card({ children, className = '', padding = 'p-5' }) {
  return (
    <div className={`bg-white dark:bg-portal-card-dark rounded-xl border border-portal-border dark:border-portal-border-dark shadow-sm ${padding} ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-base font-bold text-portal-navy dark:text-white">{title}</h3>
        {subtitle && <p className="text-xs text-portal-muted dark:text-portal-muted-dark mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}