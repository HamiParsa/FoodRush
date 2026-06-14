import { Pizza, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white/50 backdrop-blur-sm border-t border-black/5 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Main Footer Content - Redesigned */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Logo Section - New minimal style */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-black rounded-sm flex items-center justify-center">
                <Pizza className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
              </div>
              <span className="text-lg font-bold tracking-tight text-black">
                FoodRush
              </span>
            </div>
            <p className="text-[11px] text-black/40 tracking-wide uppercase">
              Instant delivery • Zero compromise
            </p>
          </div>

          {/* Empty middle column for spacing - keeps logo left aligned */}
          <div className="hidden md:block"></div>

          {/* Quick Links - New horizontal layout */}
          <div className="flex flex-row md:flex-col gap-4 md:items-end">
            <div className="flex gap-6">
              <a href="#" className="text-[13px] text-black/50 hover:text-black transition-all duration-200 hover:tracking-wide">
                Terms
              </a>
              <a href="#" className="text-[13px] text-black/50 hover:text-black transition-all duration-200 hover:tracking-wide">
                Privacy
              </a>
              <a href="#" className="text-[13px] text-black/50 hover:text-black transition-all duration-200 hover:tracking-wide">
                Contact
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Clean divider with less clutter */}
        <div className="mt-10 pt-8 border-t border-black/5">
          <p className="text-[11px] text-black/30 text-center">
            © {new Date().getFullYear()} FoodRush. All rights reserved.
          </p>
        </div>

        {/* Made with love - Redesigned as a subtle floating element */}
        <div className="flex flex-col items-center justify-center gap-2 mt-8 pt-6 text-[11px] text-black/25 border-t border-black/5">
          <div className="flex items-center gap-1.5">
            <span>Made with</span>
            <Heart className="w-2.5 h-2.5 text-black/30 fill-black/30" strokeWidth={1} />
            <span>by Hami Parsa</span>
          </div>
          <a 
            href="https://github.com/hamiparsa/foodrush" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-black/30 hover:text-black/70 transition-all duration-200 text-[10px] tracking-wide uppercase"
          >
            github.com/hamiparsa/foodrush
          </a>
        </div>

      </div>
    </footer>
  )
}