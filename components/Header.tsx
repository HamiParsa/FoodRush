'use client'

import Link from 'next/link'
import { ShoppingCart, User, LogOut, LayoutDashboard, ClipboardList, Pizza, Sparkles } from 'lucide-react'
import { useCartStore } from '../lib/cartStore'
import { createClient } from '../lib/supabase/client'
import { useEffect, useState } from 'react'
import { Profile } from '../types/index'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const supabase = createClient()

export default function Header() {
  const { getTotalItems } = useCartStore()
  const [profile, setProfile] = useState<Profile | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(data)
      }
    }
    getProfile()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setProfile(null)
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Logo - Fresh & Bold */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative w-10 h-10 bg-black rounded-2xl flex items-center justify-center text-white overflow-hidden transition-all duration-500 group-hover:rounded-3xl">
            <Pizza className="w-5 h-5 relative z-10" strokeWidth={1.5} />
            <div className="absolute inset-0 bg-linear-45 from-black to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-black leading-tight">
              FoodRush
            </span>
            <span className="text-[10px] font-medium text-black/40 tracking-wider uppercase">
              Instant delivery
            </span>
          </div>
        </Link>

        {/* Navigation - Minimal bold right section */}
        <div className="flex items-center gap-4">

          {/* Cart Button - Redesigned from scratch */}
          <Link
            href="/cart"
            className="group relative flex items-center gap-2.5 px-4 py-2 rounded-xl bg-black/5 hover:bg-black text-black/70 hover:text-white transition-all duration-300"
          >
            <ShoppingCart className="w-4 h-4 transition-transform group-hover:scale-110" strokeWidth={1.5} />
            <span className="text-sm font-medium tracking-tight">Cart</span>
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                {getTotalItems()}
              </span>
            )}
          </Link>

          {profile ? (
            <div className="flex items-center gap-3 pl-3 border-l border-black/10">
              
              {/* Orders Button */}
              <Link
                href="/orders"
                className="group flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-black/5 transition-all duration-200"
              >
                <ClipboardList className="w-4 h-4 text-black/60 group-hover:text-black transition-colors" strokeWidth={1.5} />
                <span className="text-sm font-medium text-black/70 group-hover:text-black hidden sm:inline">
                  Orders
                </span>
              </Link>

              {/* Admin Button - Conditional */}
              {profile.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                <Link
                  href="/admin"
                  className="group flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-black/5 transition-all duration-200"
                >
                  <LayoutDashboard className="w-4 h-4 text-black/60 group-hover:text-black transition-colors" strokeWidth={1.5} />
                  <span className="text-sm font-medium text-black/70 group-hover:text-black hidden sm:inline">
                    Admin
                  </span>
                </Link>
              )}

              {/* User Avatar + Logout - Clean design */}
              <div className="flex items-center gap-2 pl-2">
                <div className="group/avatar relative">
                  {profile.avatar_url ? (
                    <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-black/10 transition-all duration-300 group-hover/avatar:border-black/30">
                      <Image
                        width={1000}
                        height={1000}
                        src={profile.avatar_url}
                        alt={profile.full_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-black/5 flex items-center justify-center border border-black/10 transition-all duration-300 group-hover/avatar:bg-black/10">
                      <User className="w-4 h-4 text-black/60" strokeWidth={1.5} />
                    </div>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-black/40 hover:text-black/80 hover:bg-black/5 transition-all duration-200"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>

            </div>
          ) : (
            <Link
              href="/login"
              className="group flex items-center gap-2 px-5 py-2.5 bg-black rounded-xl text-white text-sm font-medium transition-all duration-300 hover:bg-black/90 hover:scale-105 active:scale-95 shadow-sm"
            >
              <User className="w-4 h-4" strokeWidth={1.5} />
              Sign In
              <Sparkles className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </Link>
          )}

        </div>
      </div>
    </header>
  )
}