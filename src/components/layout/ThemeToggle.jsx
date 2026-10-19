import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <button onClick={toggleTheme} aria-label="Toggle theme"
      className={`relative w-11 h-6 rounded-full transition-colors ${isDark ? 'bg-[#1a5f7a]' : 'bg-[#c3c7cc]'}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow flex items-center justify-center transition-transform ${isDark ? 'translate-x-5' : ''}`}>
        {isDark ? <Moon className="w-3 h-3 text-[#0f2b3d]" /> : <Sun className="w-3 h-3 text-[#f4a261]" />}
      </span>
    </button>
  )
}