export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex overflow-x-auto gap-1 border-b border-portal-border dark:border-portal-border-dark">
      {tabs.map(t => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition border-b-2 -mb-px
            ${active === t.key
              ? 'border-portal-cyan text-portal-navy dark:text-white'
              : 'border-transparent text-portal-muted dark:text-portal-muted-dark hover:text-portal-navy dark:hover:text-white'}`}
        >
          {t.label}
          {t.badge != null && (
            <span className="ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full bg-slate-100 dark:bg-white/10">
              {t.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}