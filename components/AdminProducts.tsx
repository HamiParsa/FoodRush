'use client'

import { useState } from 'react'
import { createClient } from '../lib/supabase/client'
import { Product, Category } from '../types/index'
import { Plus, Pencil, Trash2, X, ImagePlus, ShoppingBag, Package } from 'lucide-react'
import Image from 'next/image'

interface Props {
  initialProducts: Product[]
  categories: Category[]
}

const supabase = createClient()

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category_id: '',
  is_available: true,
}

export default function AdminProducts({ initialProducts, categories }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const openAddForm = () => {
    setEditingProduct(null)
    setForm(emptyForm)
    setImageFile(null)
    setImagePreview('')
    setShowForm(true)
  }

  const openEditForm = (product: Product) => {
    setEditingProduct(product)
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category_id: product.category_id || '',
      is_available: product.is_available,
    })
    setImagePreview(product.image_url || '')
    setImageFile(null)
    setShowForm(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`

    const { error } = await supabase.storage
      .from('products')
      .upload(fileName, file)

    if (error) return null

    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(fileName)

    return data.publicUrl
  }

  const handleSubmit = async () => {
    if (!form.name || !form.price) return
    setLoading(true)

    let imageUrl = editingProduct?.image_url || ''

    if (imageFile) {
      const uploaded = await uploadImage(imageFile)
      if (uploaded) imageUrl = uploaded
    }

    if (editingProduct) {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          category_id: form.category_id || null,
          is_available: form.is_available,
          image_url: imageUrl,
        })
        .eq('id', editingProduct.id)
        .select('*, categories(*)')
        .single()

      if (!error && data) {
        setProducts(products.map(p => p.id === editingProduct.id ? data : p))
      }
    } else {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          category_id: form.category_id || null,
          is_available: form.is_available,
          image_url: imageUrl,
        })
        .select('*, categories(*)')
        .single()

      if (!error && data) {
        setProducts([data, ...products])
      }
    }

    setLoading(false)
    setShowForm(false)
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)

    if (!error) {
      setProducts(products.filter(p => p.id !== productId))
    }
  }

  return (
    <div>
      {/* Add Button - Black */}
      <button
        onClick={openAddForm}
        className="group flex items-center gap-2 bg-gray-900 hover:bg-black text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-md shadow-gray-900/25 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
      >
        <Plus className="w-4 h-4" strokeWidth={2} />
        Add Product
      </button>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm mt-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
            <Package className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
          </div>
          <p className="text-gray-500 font-medium">No products yet</p>
          <p className="text-sm text-gray-400 mt-1">Click Add Product to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {products.map(product => (
            <div key={product.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300 hover:-translate-y-1">
              
              {/* Image */}
              <div className="relative h-40 bg-gray-50 overflow-hidden">
                {product.image_url ? (
                  <Image 
                    width={1000} 
                    height={1000} 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-gray-300" strokeWidth={1.5} />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 truncate">{product.name}</h3>
                    <p className="text-gray-900 font-black mt-1">${product.price.toFixed(2)}</p>
                    {product.categories && (
                      <span className="inline-block text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full mt-1.5">
                        {product.categories.name}
                      </span>
                    )}
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                    product.is_available 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {product.is_available ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => openEditForm(product)}
                    className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 hover:border-gray-400 hover:bg-gray-50 text-gray-600 hover:text-gray-900 text-sm font-medium py-2 rounded-full transition-all duration-200"
                  >
                    <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 border border-red-200 hover:bg-red-50 text-red-500 text-sm font-medium py-2 rounded-full transition-all duration-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                    Delete
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button 
                onClick={() => setShowForm(false)} 
                className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
              >
                <X className="w-5 h-5" strokeWidth={1.75} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-5">

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Image</label>
                <div
                  onClick={() => document.getElementById('image-upload')?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-xl h-40 flex items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 overflow-hidden"
                >
                  {imagePreview ? (
                    <Image 
                      width={1000} 
                      height={1000} 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <ImagePlus className="w-10 h-10 mx-auto mb-2" strokeWidth={1.5} />
                      <p className="text-sm font-medium">Click to upload image</p>
                      <p className="text-xs mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Product name"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Product description"
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full pl-7 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                <select
                  value={form.category_id}
                  onChange={e => setForm({ ...form, category_id: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 bg-white"
                >
                  <option value="">No category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Available Toggle */}
              <div className="flex items-center justify-between py-2">
                <label className="text-sm font-semibold text-gray-700">Available</label>
                <button
                  onClick={() => setForm({ ...form, is_available: !form.is_available })}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 ${form.is_available ? 'bg-gray-900' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${form.is_available ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold py-2.5 rounded-full transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-gray-900 hover:bg-black disabled:bg-gray-300 text-white font-semibold py-2.5 rounded-full transition-all duration-200 shadow-md shadow-gray-900/25 hover:shadow-lg"
              >
                {loading ? 'Saving...' : editingProduct ? 'Update' : 'Add Product'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}