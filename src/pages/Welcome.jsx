import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Shield, Zap, Smartphone, ArrowRight, CheckCircle, LayoutDashboard, Apple, Play } from 'lucide-react'

export default function Welcome() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [platform, setPlatform] = useState('desktop')

  useEffect(() => {
    // 1. Detect platform
    const userAgent = navigator.userAgent.toLowerCase()
    if (/iphone|ipad|ipod/.test(userAgent)) setPlatform('ios')
    else if (/android/.test(userAgent)) setPlatform('android')
    else setPlatform('desktop')

  
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true)
    }

    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)

    const installedHandler = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    }
    window.addEventListener('appinstalled', installedHandler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', installedHandler)
    }
  }, [])

  const handleAndroidInstall = async () => {
    if (!deferredPrompt) {
      alert("Install prompt not ready yet. Please try again in a moment, or use the browser menu.")
      return
    }
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setIsInstalled(true)
    }
    setDeferredPrompt(null)
  }

  return (
    <div className="min-h-screen bg-[#0f2b3d] text-white flex flex-col relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-[#1a5f7a] blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#00b4d8] blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <main className="relative flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-lg mx-auto w-full z-10">
        
        {/* Logo */}
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-6">
          <LayoutDashboard className="w-12 h-12 text-[#0f2b3d]" />
        </div>

        <h1 className="text-3xl font-bold text-center mb-2 tracking-tight">Geo Solution</h1>
        <p className="text-[#a3dfff] text-center font-medium mb-8">Exam & Training Management System</p>

        {/* Features */}
        <div className="w-full space-y-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-[#00b4d8]" />
            </div>
            <div>
              <p className="font-semibold text-sm">Secure & Private</p>
              <p className="text-xs text-white/60">Your data is encrypted and safe</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-[#f4a261]" />
            </div>
            <div>
              <p className="font-semibold text-sm">Fast & Reliable</p>
              <p className="text-xs text-white/60">Manage attendance and finance instantly</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-[#2d9b4e]" />
            </div>
            <div>
              <p className="font-semibold text-sm">Works Offline</p>
              <p className="text-xs text-white/60">Install as an app on your phone or PC</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3">
          {isInstalled ? (
            <div className="flex items-center justify-center gap-2 p-4 bg-[#2d9b4e]/20 text-[#2d9b4e] rounded-xl font-semibold border border-[#2d9b4e]/30">
              <CheckCircle className="w-5 h-5" /> App Installed
            </div>
          ) : (
            <>
              {/* ANDROID BUTTON */}
              {(platform === 'android' || platform === 'desktop') && (
                <button
                  onClick={handleAndroidInstall}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition ${
                    deferredPrompt 
                      ? 'bg-[#00b4d8] text-[#0f2b3d] hover:bg-[#a3dfff] shadow-lg' 
                      : 'bg-white/10 text-white/50'
                  }`}
                >
                  <Play className="w-5 h-5" />
                  Download for Android
                </button>
              )}

              {/* IOS BUTTON */}
              {platform === 'ios' && (
                <div className="p-4 bg-white/10 rounded-xl space-y-2 border border-white/20">
                  <p className="font-bold text-sm flex items-center gap-2">
                    <Apple className="w-5 h-5" /> Download for iPhone
                  </p>
                  <p className="text-xs text-white/70">1. Tap the <strong>Share</strong> button in Safari</p>
                  <p className="text-xs text-white/70">2. Scroll down and tap <strong>Add to Home Screen</strong></p>
                  <p className="text-xs text-white/70">3. Tap <strong>Add</strong> to confirm</p>
                </div>
              )}
            </>
          )}

          <Link
            to="/login"
            className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 transition text-white mt-2"
          >
            Go to Login Portal
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <p className="text-[10px] text-white/40 text-center mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </main>
    </div>
  )
}