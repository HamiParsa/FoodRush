import { createClient } from '../../../lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminProducts from '../../../components/AdminProducts'
import AdminOrders from '../../../components/AdminOrders'
import { LayoutDashboard, Package, ShoppingBag } from 'lucide-react'

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Only allow admin email
  if (user.email !== process.env.ADMIN_EMAIL) redirect('/')

  const [{ data: products }, { data: categories }, { data: orders }] = await Promise.all([
    supabase.from('products').select('*, categories(*)').order('created_at', { ascending: false }),
    supabase.from('categories').select('*'),
    supabase.from('orders').select('*, profiles(*), order_items(*, products(*))').order('created_at', { ascending: false }),
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Header with icon */}
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200">
          <div className="p-2 bg-black rounded-xl shadow-sm">
            <LayoutDashboard className="w-5 h-5 text-white" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Admin Panel
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">Manage your store</p>
          </div>
        </div>

        {/* Stats Cards - New */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-medium">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{orders?.length || 0}</p>
              </div>
              <div className="w-10 h-10 bg-black/5 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-black/60" strokeWidth={1.5} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-medium">Total Products</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{products?.length || 0}</p>
              </div>
              <div className="w-10 h-10 bg-black/5 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-black/60" strokeWidth={1.5} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-medium">Categories</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{categories?.length || 0}</p>
              </div>
              <div className="w-10 h-10 bg-black/5 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-black/60" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-6 bg-black rounded-full" />
            <h2 className="text-lg font-bold text-gray-900">Orders Management</h2>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full ml-2">
              {orders?.length || 0}
            </span>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <AdminOrders initialOrders={orders || []} />
          </div>
        </div>

        {/* Products Section */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-6 bg-black rounded-full" />
            <h2 className="text-lg font-bold text-gray-900">Products Management</h2>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full ml-2">
              {products?.length || 0}
            </span>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <AdminProducts
              initialProducts={products || []}
              categories={categories || []}
            />
          </div>
        </div>

      </div>
    </div>
  )
}