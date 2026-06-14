'use client'

import { createClient } from '../../../lib/supabase/client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Pizza, LogIn } from 'lucide-react'

const supabase = createClient()

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) router.push('/')
    }
    checkUser()
  }, [router])

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 py-12">
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-black/5 p-8 lg:p-10 w-full max-w-md text-center shadow-sm">
        
        {/* Logo / Icon - Minimal */}
        <div className="inline-flex items-center justify-center w-14 h-14 bg-black rounded-sm mb-6">
          <Pizza className="w-6 h-6 text-white" strokeWidth={1.5} />
        </div>
        
        <h1 className="text-2xl lg:text-3xl font-light tracking-tight text-black mb-2">
          Sign in
        </h1>
        
        <p className="text-black/40 text-sm mb-8">
          Continue to order your favorites
        </p>

        <button
          onClick={handleGoogleLogin}
          className="group w-full flex items-center justify-center gap-3 border border-black/10 hover:border-black/30 bg-white text-black/70 hover:text-black font-medium py-3 px-4 rounded-full transition-all duration-200 hover:shadow-sm"
        >
          <Image 
            width={20} 
            height={20} 
            src="https://www.google.com/favicon.ico" 
            alt="Google" 
            className="w-4 h-4 transition-transform group-hover:scale-105"
          />
          Continue with Google
          <LogIn className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" strokeWidth={1.5} />
        </button>

        {/* Divider - Subtle */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-black/5"></div>
          </div>
          <div className="relative flex justify-center text-[10px]">
            <span className="px-3 bg-white/50 text-black/30 tracking-wide uppercase">Secure login</span>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-[10px] text-black/25 tracking-wide">
          By continuing, you agree to our Terms
        </p>

      </div>
    </div>
  )
}