'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase/client'
import { Product, Category } from '../../types/index'
import ProductCard from '../../components/ProductCard'
import { Search, Pizza, Coffee, Utensils, Sparkles, Star, Clock, Award, Beef, Cookie, Sandwich, Milk, Drumstick } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const supabase = createClient()

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: productsData }, { data: categoriesData }] = await Promise.all([
        supabase.from('products').select('*, categories(*)').eq('is_available', true),
        supabase.from('categories').select('*'),
      ])
      setProducts(productsData || [])
      setCategories(categoriesData || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const filtered = products.filter(p => {
    const matchCategory = selectedCategory === 'all' || p.category_id === selectedCategory
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  const getCategoryIcon = (catName: string): LucideIcon | null => {
    const icons: Record<string, LucideIcon> = {
      'Pizza': Pizza,
      'Coffee': Coffee,
      'Fast Food': Utensils,
      'Burger': Beef,
      'Dessert': Cookie,
      'Sandwich': Sandwich,
      'Drinks': Milk,
    }
    return icons[catName] || null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

      {/* Hero Section */}
      <div className="relative bg-linear-to-br from-gray-900 via-black to-gray-900 rounded-3xl p-8 sm:p-12 mb-12 overflow-hidden">
        
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-linear-to-r from-orange-500/15 via-yellow-500/15 to-red-500/15 animate-gradient" />
        
        {/* Floating particles - خاموش روشن شون */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-orange-400 rounded-full animate-float-particle" />
        <div className="absolute top-20 right-20 w-3 h-3 bg-yellow-400 rounded-full animate-float-particle-delayed" />
        <div className="absolute bottom-10 left-1/3 w-2 h-2 bg-red-400 rounded-full animate-float-particle-slow" />
        <div className="absolute top-1/2 right-10 w-1.5 h-1.5 bg-orange-300 rounded-full animate-float-particle" />
        <div className="absolute top-32 left-1/4 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-float-particle-delayed" />
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-red-300 rounded-full animate-float-particle-slow" />
        <div className="absolute top-1/3 left-1/2 w-1 h-1 bg-orange-400 rounded-full animate-float-particle" />
        <div className="absolute bottom-1/2 right-1/4 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-float-particle-delayed" />
        
        <div className="relative z-10">
          
          {/* Top badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-white/90">#1 Food Delivery in Town</span>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Left side - Text content */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
                Craving 
                <span className="block text-transparent bg-linear-to-r from-orange-400 via-yellow-400 to-red-400 bg-clip-text animate-gradient-text">
                  Something Good?
                </span>
              </h1>
              
              <p className="text-white/70 text-base sm:text-lg max-w-md mx-auto lg:mx-0 mb-8">
                From juicy burgers to cheesy pizzas and crispy fries — we bring the heat, right to your door. Fresh, fast, and dangerously delicious.
              </p>
              
              <div className="flex flex-wrap gap-5 justify-center lg:justify-start mb-8">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-white/70">30 min delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-white/70">4.9 ★ (2k+ reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-white/70">Best of 2024</span>
                </div>
              </div>

              {/* CTA Button */}
              <button className="group bg-white text-black px-8 py-3 rounded-full font-bold text-base transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-2 mx-auto lg:mx-0">
                Order Now
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </button>
            </div>

            {/* Right side - Only floating neon icons, no borders, no text */}
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-8 items-center">
                
                {/* Pizza - Large */}
                <div className="col-span-2 flex justify-center mb-4">
                  <div className="animate-float-slow">
                    <Pizza 
                      className="w-28 h-28 sm:w-36 sm:h-36 text-orange-400 drop-shadow-[0_0_15px_rgba(249,115,22,0.8)] hover:drop-shadow-[0_0_25px_rgba(249,115,22,1)] transition-all duration-300 cursor-pointer" 
                      strokeWidth={1.2} 
                    />
                  </div>
                </div>

                {/* Burger */}
                <div className="animate-float flex justify-center">
                  <Beef 
                    className="w-20 h-20 sm:w-24 sm:h-24 text-amber-500 drop-shadow-[0_0_12px_rgba(245,158,11,0.7)] hover:drop-shadow-[0_0_20px_rgba(245,158,11,0.9)] transition-all duration-300 cursor-pointer" 
                    strokeWidth={1.2} 
                  />
                </div>

                {/* Hot Dog */}
                <div className="animate-float-delayed flex justify-center">
                  <Drumstick 
                    className="w-20 h-20 sm:w-24 sm:h-24 text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.7)] hover:drop-shadow-[0_0_20px_rgba(239,68,68,0.9)] transition-all duration-300 cursor-pointer" 
                    strokeWidth={1.2} 
                  />
                </div>

                {/* Sandwich */}
                <div className="animate-float-slow flex justify-center">
                  <Sandwich 
                    className="w-20 h-20 sm:w-24 sm:h-24 text-green-500 drop-shadow-[0_0_12px_rgba(34,197,94,0.7)] hover:drop-shadow-[0_0_20px_rgba(34,197,94,0.9)] transition-all duration-300 cursor-pointer" 
                    strokeWidth={1.2} 
                  />
                </div>

                {/* Drink */}
                <div className="animate-float flex justify-center">
                  <Coffee 
                    className="w-20 h-20 sm:w-24 sm:h-24 text-cyan-500 drop-shadow-[0_0_12px_rgba(6,182,212,0.7)] hover:drop-shadow-[0_0_20px_rgba(6,182,212,0.9)] transition-all duration-300 cursor-pointer" 
                    strokeWidth={1.2} 
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8 max-w-md mx-auto lg:mx-0">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search className="w-4 h-4 text-black/40" strokeWidth={1.5} />
        </div>
        <input
          type="text"
          placeholder="Search for pizza, burger, sushi..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-black/10 rounded-full focus:outline-none focus:border-black/30 transition-all duration-200 text-black placeholder:text-black/30 text-sm"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
            selectedCategory === 'all'
              ? 'bg-black text-white'
              : 'bg-black/5 text-black/70 hover:bg-black/10'
          }`}
        >
          All
        </button>
        {categories.map(cat => {
          const Icon = getCategoryIcon(cat.name)
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat.id
                  ? 'bg-black text-white'
                  : 'bg-black/5 text-black/70 hover:bg-black/10'
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {cat.name}
            </button>
          )
        })}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-black/5 rounded-2xl h-80 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-black/5 rounded-2xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black/10 rounded-full mb-4">
            <Search className="w-6 h-6 text-black/30" />
          </div>
          <p className="text-black/50">No food found</p>
        </div>
      ) : (
        <>
          <div className="mb-5">
            <p className="text-sm text-black/50">{filtered.length} items</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-particle {
          0%, 100% { 
            transform: translateY(0px) translateX(0px);
            opacity: 0;
          }
          50% { 
            transform: translateY(-30px) translateX(15px);
            opacity: 1;
          }
        }
        @keyframes float-particle-delayed {
          0%, 100% { 
            transform: translateY(0px) translateX(0px);
            opacity: 0;
          }
          50% { 
            transform: translateY(-25px) translateX(-15px);
            opacity: 1;
          }
        }
        @keyframes float-particle-slow {
          0%, 100% { 
            transform: translateY(0px) translateX(0px);
            opacity: 0;
          }
          50% { 
            transform: translateY(-20px) translateX(10px);
            opacity: 0.7;
          }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes gradient-text {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 3.5s ease-in-out infinite;
        }
        .animate-float-particle {
          animation: float-particle 5s ease-in-out infinite;
        }
        .animate-float-particle-delayed {
          animation: float-particle-delayed 6s ease-in-out infinite;
        }
        .animate-float-particle-slow {
          animation: float-particle-slow 7s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }
        .animate-gradient-text {
          background-size: 200% 200%;
          animation: gradient-text 6s ease infinite;
        }
      `}</style>

    </div>
  )
}