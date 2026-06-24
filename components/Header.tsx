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
  const [loading, setLoading] = useState(true)
  const [avatarError, setAvatarError] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    const getProfile = async () => {
      try {
        setLoading(true)
        
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          if (isMounted) {
            setProfile(null)
            setLoading(false)
          }
          return
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error fetching profile:', error)
          if (isMounted) setProfile(null)
        } else {
          if (isMounted) {
            setProfile(data)
            setAvatarError(false)
          }
        }
      } catch (error) {
        console.error('Unexpected error:', error)
        if (isMounted) setProfile(null)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    getProfile()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return
      
      if (event === 'SIGNED_IN' && session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        if (isMounted) {
          setProfile(data)
          setAvatarError(false)
        }
      } else if (event === 'SIGNED_OUT') {
        if (isMounted) {
          setProfile(null)
          setAvatarError(false)
        }
      }
    })

    return () => {
      isMounted = false
      authListener?.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setProfile(null)
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-2xl animate-pulse"></div>
            <div className="flex flex-col">
              <div className="w-24 h-5 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-16 h-3 bg-gray-200 rounded mt-1 animate-pulse"></div>
            </div>
          </div>
          <div className="w-32 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Logo Section */}
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

        {/* Navigation Section */}
        <div className="flex items-center gap-4">

          {/* Cart Button */}
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

          {/* User Section - Logged In */}
          {profile ? (
            <div className="flex items-center gap-3 pl-3 border-l border-black/10">
              
              {/* Orders Link */}
              <Link
                href="/orders"
                className="group flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-black/5 transition-all duration-200"
              >
                <ClipboardList className="w-4 h-4 text-black/60 group-hover:text-black transition-colors" strokeWidth={1.5} />
                <span className="text-sm font-medium text-black/70 group-hover:text-black hidden sm:inline">
                  Orders
                </span>
              </Link>

              {/* Admin Link - Conditional */}
              {profile?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
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

              {/* User Avatar & Logout */}
              <div className="flex items-center gap-2 pl-2">
                <div className="group/avatar relative flex items-center gap-2">
                  {profile?.avatar_url && !avatarError ? (
                    <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-black/10 transition-all duration-300 group-hover/avatar:border-black/30">
                      <Image
                        width={36}
                        height={36}
                        src={profile.avatar_url}
                        alt={profile.full_name || 'User avatar'}
                        className="w-full h-full object-cover"
                        priority
                        onError={() => setAvatarError(true)}
                        unoptimized={profile.avatar_url.startsWith('data:')}
                      />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-black/5 flex items-center justify-center border border-black/10 transition-all duration-300 group-hover/avatar:bg-black/10">
                      <User className="w-4 h-4 text-black/60" strokeWidth={1.5} />
                    </div>
                  )}
                  <span className="text-sm font-medium text-black/70 hidden sm:inline">
                    {profile?.full_name?.split(' ')[0] || 'User'}
                  </span>
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
            /* Sign In Button - Logged Out */
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