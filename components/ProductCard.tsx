'use client'

import { Product } from '../types/index'
import { useCartStore } from '../lib/cartStore'
import { Plus, ShoppingBag, AlertCircle, Star } from 'lucide-react'
import Image from 'next/image'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const { addItem, items } = useCartStore()

  const cartItem = items.find(i => i.product.id === product.id)

  return (
    <div className="group relative bg-white rounded-3xl border border-gray-100 overflow-hidden hover:border-gray-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
      
      {/* Image Container with zoom effect */}
      <div className="relative h-52 bg-gray-50 overflow-hidden">
        {product.image_url ? (
          <Image
            width={1000}
            height={1000}
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <ShoppingBag className="w-14 h-14 text-gray-300" strokeWidth={1} />
          </div>
        )}
        
        {/* Price badge - minimal black */}
        <div className="absolute top-4 left-4 bg-black text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
          ${product.price.toFixed(2)}
        </div>

        {/* Rating badge - new */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-black shadow-sm flex items-center gap-1">
          <Star className="w-3 h-3 fill-black text-black" />
          <span>4.8</span>
        </div>

        {/* Unavailable overlay */}
        {!product.is_available && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
            <AlertCircle className="w-8 h-8 text-black/40" strokeWidth={1.5} />
            <span className="text-black/50 font-medium text-sm">Unavailable</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-1 mb-1">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-5 pt-2 border-t border-gray-50">
          <div>
            {cartItem ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-black bg-gray-100 px-2 py-1 rounded-full">
                  {cartItem.quantity} in cart
                </span>
              </div>
            ) : (
              <div className="w-16" />
            )}
          </div>

          <button
            onClick={() => addItem(product)}
            disabled={!product.is_available}
            className={`
              group/btn flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-2xl 
              transition-all duration-300 active:scale-95
              ${product.is_available 
                ? 'bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl' 
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }
            `}
          >
            <Plus className="w-4 h-4 transition-transform group-hover/btn:rotate-90 duration-300" strokeWidth={1.8} />
            {cartItem ? 'Add More' : 'Add to Cart'}
          </button>
        </div>
      </div>

    </div>
  )
}