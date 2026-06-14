'use client'

import { useState } from 'react'
import { createClient } from '../lib/supabase/client'
import { Clock, Package, User, Mail, ChevronDown } from 'lucide-react'
import Image from 'next/image'

interface OrderItem {
  id: string
  quantity: number
  price: number
  products: { name: string; image_url: string } | null
}

interface Order {
  id: string
  total_price: number
  status: string
  created_at: string
  profiles: { full_name: string; email: string } | null
  order_items: OrderItem[]
}

interface Props {
  initialOrders: Order[]
}

const supabase = createClient()

const statusOptions = ['pending', 'preparing', 'delivered', 'cancelled']

const statusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-gray-100 text-gray-700 border-gray-200'
    case 'preparing': return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'cancelled': return 'bg-red-50 text-red-700 border-red-200'
    default: return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending': return 'Pending'
    case 'preparing': return 'Preparing'
    case 'delivered': return 'Delivered'
    case 'cancelled': return 'Cancelled'
    default: return status
  }
}

export default function AdminOrders({ initialOrders }: Props) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (!error) {
      setOrders(orders.map(o =>
        o.id === orderId ? { ...o, status: newStatus } : o
      ))
    }
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
          <Package className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
        </div>
        <p className="text-gray-500 font-medium">No orders yet</p>
        <p className="text-sm text-gray-400 mt-1">Orders will appear here once customers place them</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {orders.map(order => (
        <div key={order.id} className="group bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 hover:shadow-lg transition-all duration-300">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-gray-100">
            
            {/* Customer Info */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-700" strokeWidth={1.75} />
                </div>
                <p className="font-bold text-gray-800">
                  {order.profiles?.full_name || 'Unknown User'}
                </p>
              </div>
              
              <div className="flex items-center gap-1.5 text-sm text-gray-500 ml-10">
                <Mail className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>{order.profiles?.email}</span>
              </div>
              
              <div className="flex items-center gap-1.5 text-xs text-gray-400 ml-10">
                <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>
                  {new Date(order.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>

            {/* Status Dropdown - No orange */}
            <div className="relative">
              <select
                value={order.status}
                onChange={e => handleStatusChange(order.id, e.target.value)}
                className={`appearance-none text-sm font-semibold px-4 py-2 pr-8 rounded-full border cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 ${statusColor(order.status)}`}
              >
                {statusOptions.map(s => (
                  <option key={s} value={s}>
                    {getStatusLabel(s)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none text-current opacity-60" strokeWidth={1.75} />
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-3 mb-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Items</p>
            {order.order_items?.map(item => (
              <div key={item.id} className="flex items-center gap-3 sm:gap-4 group/item hover:bg-gray-50 rounded-xl p-2 -m-2 transition-all duration-200">
                
                {/* Product Image */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-gray-50 shrink-0 shadow-sm">
                  {item.products?.image_url ? (
                    <Image 
                      width={1000} 
                      height={1000} 
                      src={item.products.image_url} 
                      alt={item.products.name} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                    {item.products?.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Quantity: {item.quantity}
                  </p>
                </div>

                {/* Price - No orange */}
                <p className="text-sm sm:text-base font-bold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Order Total */}
          <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>Order ID:</span>
              <span className="font-mono text-gray-500 bg-gray-50 px-2 py-0.5 rounded">{order.id.slice(0, 8)}...</span>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-6">
              <span className="text-gray-600 text-sm font-medium">Total</span>
              <span className="text-xl sm:text-2xl font-black text-gray-900">
                ${order.total_price.toFixed(2)}
              </span>
            </div>
          </div>

        </div>
      ))}
    </div>
  )
}