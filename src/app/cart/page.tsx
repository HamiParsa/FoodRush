'use client'

import { useCartStore } from '../../../lib/cartStore'
import { createClient } from '../../../lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Minus, Plus, Trash2, ShoppingBag, Pizza, Truck, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'

const supabase = createClient()

export default function CartPage() {
  const { items, increaseQuantity, decreaseQuantity, removeItem, getTotalPrice, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handlePlaceOrder = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    setLoading(true)

    // Insert order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_price: getTotalPrice(),
        status: 'pending',
      })
      .select()
      .single()

    if (orderError || !order) {
      setLoading(false)
      alert('Something went wrong. Please try again.')
      return
    }

    // Insert order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      setLoading(false)
      alert('Something went wrong. Please try again.')
      return
    }

    clearCart()
    setLoading(false)
    router.push('/orders')
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 lg:px-8 py-24 lg:py-32 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-black/5 rounded-2xl mb-6">
          <ShoppingBag className="w-10 h-10 text-black/30" strokeWidth={1} />
        </div>
        <h2 className="text-2xl lg:text-3xl font-light text-black tracking-tight mb-2">Cart is empty</h2>
        <p className="text-black/40 text-sm mb-8">Add some items to get started</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-300 hover:bg-black/80 hover:scale-105 active:scale-95"
        >
          <Pizza className="w-3.5 h-3.5" strokeWidth={1.5} />
          Browse Menu
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
      
      {/* Page Header - Minimal */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center">
          <ShoppingBag className="w-4 h-4 text-white" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl lg:text-3xl font-light tracking-tight text-black">Cart</h1>
        <span className="text-sm text-black/30 ml-2">({items.length})</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Items Section - Clean cards */}
        <div className="flex-1 space-y-3">
          {items.map(item => (
            <div key={item.product.id} className="group bg-white/50 backdrop-blur-sm rounded-xl border border-black/5 p-5 flex gap-5 transition-all duration-200 hover:border-black/10 hover:shadow-sm">
              
              {/* Image */}
              <div className="w-20 h-20 rounded-md overflow-hidden bg-black/5 shrink-0">
                {item.product.image_url ? (
                  <Image 
                    width={1000} 
                    height={1000} 
                    src={item.product.image_url} 
                    alt={item.product.name} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Pizza className="w-6 h-6 text-black/20" strokeWidth={1} />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-black text-base line-clamp-1">{item.product.name}</h3>
                    <p className="text-black/60 text-sm mt-1">${item.product.price.toFixed(2)} each</p>
                  </div>
                  <p className="font-medium text-black text-lg">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => decreaseQuantity(item.product.id)}
                    className="w-8 h-8 rounded-md bg-black/5 hover:bg-black text-black/50 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-105"
                  >
                    <Minus className="w-3 h-3" strokeWidth={1.5} />
                  </button>
                  <span className="font-medium text-black min-w-10 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(item.product.id)}
                    className="w-8 h-8 rounded-md bg-black/5 hover:bg-black text-black/50 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-105"
                  >
                    <Plus className="w-3 h-3" strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="ml-2 w-8 h-8 rounded-md text-black/25 hover:text-red-500 hover:bg-red-50 transition-all duration-200 flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Summary Section - Minimal card */}
        <div className="lg:w-96">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-black/5 p-6 sticky top-24">
            <h2 className="text-base font-medium text-black mb-5 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-black/40" strokeWidth={1.5} />
              Summary
            </h2>
            
            <div className="space-y-3 mb-5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-black/50">Subtotal</span>
                <span className="text-black/80">${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm pb-3 border-b border-black/5">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-black/40" strokeWidth={1.5} />
                  <span className="text-black/50">Delivery</span>
                </div>
                <span className="text-black/60 text-xs uppercase tracking-wide">Free</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-base font-medium text-black">Total</span>
                <span className="text-2xl font-light tracking-tight text-black">${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full bg-black text-white hover:bg-black/80 disabled:bg-black/20 disabled:cursor-not-allowed font-medium py-3.5 rounded-full transition-all duration-300 hover:scale-[0.98] text-sm"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
            
            <p className="text-[10px] text-black/25 text-center mt-4 tracking-wide">
              By placing order you agree to our Terms
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}