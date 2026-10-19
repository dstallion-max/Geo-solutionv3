import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = original }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl' }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end lg:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizes[size]} lg:rounded-2xl rounded-t-2xl bg-white dark:bg-[#1b263b] shadow-2xl max-h-[90vh] overflow-y-auto border-t lg:border dark:border-[#2f3e52] animate-fade-in-up`}>
        <div className="lg:hidden flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-[#c3c7cc] dark:bg-white/20" />
        </div>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#c3c7cc]/20 dark:border-[#2f3e52] sticky top-0 bg-white dark:bg-[#1b263b] z-10">
          <h3 className="text-lg font-bold text-[#0f2b3d] dark:text-white">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#efedef] dark:hover:bg-[#2f3e52]">
            <X className="w-5 h-5 text-[#73777d] dark:text-[#a0aec0]" />
          </button>
        </div>
        <div className="p-5">{children}</div>
        {footer && (
          <div className="px-5 pb-5 flex gap-2 justify-end sticky bottom-0 bg-white dark:bg-[#1b263b] pt-3 border-t border-[#c3c7cc]/20 dark:border-[#2f3e52]">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}