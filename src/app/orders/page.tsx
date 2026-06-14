import { createClient } from "../../../lib/supabase/server";
import { redirect } from "next/navigation";
import { ShoppingBag, Clock, Package, CheckCircle, XCircle, Truck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function OrdersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*, products(*))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const statusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "preparing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-3.5 h-3.5" strokeWidth={1.75} />;
      case "preparing":
        return <Truck className="w-3.5 h-3.5" strokeWidth={1.75} />;
      case "delivered":
        return <CheckCircle className="w-3.5 h-3.5" strokeWidth={1.75} />;
      case "cancelled":
        return <XCircle className="w-3.5 h-3.5" strokeWidth={1.75} />;
      default:
        return <Package className="w-3.5 h-3.5" strokeWidth={1.75} />;
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 lg:px-8 py-24 lg:py-32 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-black/5 rounded-2xl mb-6">
          <Package className="w-10 h-10 text-black/30" strokeWidth={1} />
        </div>
        <h2 className="text-2xl lg:text-3xl font-light text-black tracking-tight mb-2">No orders yet</h2>
        <p className="text-black/40 text-sm mb-8">Start exploring and order your favorites</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-300 hover:bg-black/80 hover:scale-105 active:scale-95"
        >
          <ShoppingBag className="w-3.5 h-3.5" strokeWidth={1.5} />
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
      
      {/* Page Header - Minimal */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center">
          <ShoppingBag className="w-4 h-4 text-white" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl lg:text-3xl font-light tracking-tight text-black">Orders</h1>
        <span className="text-sm text-black/30 ml-2">({orders.length})</span>
      </div>

      {/* Orders List - Clean cards */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="group bg-white/50 backdrop-blur-sm rounded-2xl border border-black/5 p-6 lg:p-7 transition-all duration-300 hover:border-black/10 hover:shadow-sm"
          >
            
            {/* Order Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5 pb-5 border-b border-black/5">
              <div className="flex items-center gap-2 text-black/40 text-xs tracking-wide uppercase">
                <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(order.status)}
                <span
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full capitalize border ${statusColor(order.status)}`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            {/* Order Items - Clean grid */}
            <div className="space-y-3 mb-5">
              {order.order_items?.map(
                (item: {
                  id: string;
                  products: { name: string; image_url: string } | null;
                  quantity: number;
                  price: number;
                }) => (
                  <div key={item.id} className="flex items-center gap-4 py-2">
                    
                    {/* Product Image - Minimal square */}
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-black/5 shrink-0">
                      {item.products?.image_url ? (
                        <Image
                          width={1000}
                          height={1000}
                          src={item.products.image_url}
                          alt={item.products.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-4 h-4 text-black/20" strokeWidth={1} />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-black truncate">
                        {item.products?.name}
                      </p>
                      <p className="text-[11px] text-black/30 mt-0.5">
                        Qty {item.quantity}
                      </p>
                    </div>

                    {/* Price */}
                    <p className="text-sm font-medium text-black">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ),
              )}
            </div>

            {/* Order Total - Clean bottom section */}
            <div className="border-t border-black/5 pt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[10px] text-black/25 font-mono tracking-wide">
                <span>ORDER ID</span>
                <span>{order.id.slice(0, 12)}</span>
              </div>
              <div className="flex items-center justify-between lg:justify-end gap-4">
                <span className="text-black/40 text-xs uppercase tracking-wide">Total</span>
                <span className="text-xl font-light tracking-tight text-black">
                  ${order.total_price.toFixed(2)}
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}