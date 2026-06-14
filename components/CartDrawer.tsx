'use client'

import { useCartStore } from '../lib/cartStore'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: Props) {
  const { items, increaseQuantity, decreaseQuantity, removeItem, getTotalPrice } = useCartStore()

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-420px bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-white" strokeWidth={1.5} />
            </div>
            Your Cart
            {items.length > 0 && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full ml-1">
                {items.length}
              </span>
            )}
          </h2>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-all duration-200"
          >
            <X className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 h-[calc(100%-180px)]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-gray-300" strokeWidth={1} />
              </div>
              <p className="text-gray-500 font-medium">Your cart is empty</p>
              <p className="text-sm text-gray-400">Add some delicious items to get started</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.product.id} className="flex gap-3 bg-gray-50 rounded-xl p-3 hover:shadow-sm transition-all duration-200">
                
                {/* Image */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {item.product.image_url ? (
                    <Image 
                      width={1000} 
                      height={1000} 
                      src={item.product.image_url} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl bg-gray-100">
                      🍔
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{item.product.name}</p>
                  <p className="text-gray-900 font-bold text-sm mt-0.5">${(item.product.price * item.quantity).toFixed(2)}</p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button 
                      onClick={() => decreaseQuantity(item.product.id)} 
                      className="w-6 h-6 rounded-md bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all duration-200"
                    >
                      <Minus className="w-3 h-3 text-gray-700" strokeWidth={1.5} />
                    </button>
                    <span className="text-sm font-medium text-gray-700 w-5 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => increaseQuantity(item.product.id)} 
                      className="w-6 h-6 rounded-md bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all duration-200"
                    >
                      <Plus className="w-3 h-3 text-gray-700" strokeWidth={1.5} />
                    </button>
                    <button 
                      onClick={() => removeItem(item.product.id)} 
                      className="ml-auto w-7 h-7 flex items-center justify-center hover:bg-red-50 rounded-md transition-all duration-200"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-gray-100 bg-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 text-sm font-medium">Subtotal</span>
              <span className="text-2xl font-bold text-gray-900 tracking-tight">${getTotalPrice().toFixed(2)}</span>
            </div>
            <Link
              href="/cart"
              onClick={onClose}
              className="block w-full bg-gray-900 hover:bg-black text-white text-center font-semibold py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg active:scale-95"
            >
              Proceed to Cart
            </Link>
            <p className="text-xs text-gray-400 text-center mt-3">Shipping calculated at checkout</p>
          </div>
        )}

      </div>
    </>
  )
}