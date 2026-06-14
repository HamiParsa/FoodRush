export interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url: string
  is_admin: boolean
  created_at: string
}

export interface Category {
  id: string
  name: string
  created_at: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category_id: string
  is_available: boolean
  created_at: string
  categories?: Category
}

export interface Order {
  id: string
  user_id: string
  total_price: number
  status: 'pending' | 'preparing' | 'delivered' | 'cancelled'
  created_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  products?: Product
}

export interface CartItem {
  product: Product
  quantity: number
}