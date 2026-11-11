// app/admin/page.tsx
"use client"

import { useState, useEffect } from "react"

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  images: string
  stock: number
}

interface Order {
  id: string
  name: string
  phone: string
  address: string
  total: number
  items: string
  createdAt: string
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loadingOrders, setLoadingOrders] = useState(true)
  
  // حقول نموذج إضافة منتج جديد
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [stock, setStock] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // جلب المنتجات
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products")
      const data = await res.json()
      if (Array.isArray(data)) setProducts(data)
      setLoadingProducts(false)
    } catch (error) {
      console.error("Error fetching products:", error)
      setLoadingProducts(false)
    }
  }

  // جلب الطلبات
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders")
      const data = await res.json()
      if (Array.isArray(data)) setOrders(data)
      setLoadingOrders(false)
    } catch (error) {
      console.error("Error fetching orders:", error)
      setLoadingOrders(false)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchOrders()
  }, [])

  // إضافة منتج جديد مع صورة من الجهاز
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !price || !imageFile) {
      alert("الرجاء ملء الحقول الإجبارية واختيار صورة المنتج من الجهاز")
      return
    }

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("stock", stock)
      formData.append("image", imageFile)

      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        setName("")
        setDescription("")
        setPrice("")
        setImageFile(null)
        setStock("")
        fetchProducts()
        alert("تم إضافة المنتج والصورة بنجاح! 🎉")
      } else {
        alert("حدث خطأ أثناء إضافة المنتج")
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setSubmitting(false)
    }
  }

  // حذف منتج
  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا المنتج؟")) return

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id))
        alert("تم حذف المنتج بنجاح! 🗑️")
      } else {
        alert("تعذر حذف المنتج، تأكد من مسار الـ API")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* الهيدر */}
        <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              لوحة التحكم الإدارية ⚙️
            </h1>
            <p className="text-slate-400 text-sm mt-1">إدارة منتجات المتجر ومتابعة طلبات العملاء</p>
          </div>
          <a href="/" className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-indigo-400 px-5 py-2.5 rounded-2xl text-sm font-bold transition shadow">
            عرض المتجر 🛍️
          </a>
        </div>

        {/* قسم المنتجات والإضافة */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
          {/* نموذج إضافة منتج */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl shadow-xl h-fit">
            <h2 className="text-xl font-bold text-white mb-6">➕ إضافة منتج جديد</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">اسم المنتج *</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="مثال: سماعة لاسلكية" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">الوصف</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="وصف مختصر للمنتج..." 
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">السعر ($) *</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    placeholder="99.00" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">الكمية بالمخزن</label>
                  <input 
                    type="number" 
                    value={stock} 
                    onChange={(e) => setStock(e.target.value)} 
                    placeholder="10" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">صورة المنتج من الجهاز *</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer transition"
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-indigo-600/30 transition duration-200 mt-4 active:scale-95 disabled:opacity-50"
              >
                {submitting ? "جاري الحفظ..." : "حفظ وإضافة المنتج 🚀"}
              </button>
            </form>
          </div>

          {/* قائمة المنتجات الحالية */}
          <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6">📦 المنتجات المسجلة ({products.length})</h2>

            {loadingProducts ? (
              <div className="text-center py-20 text-slate-400">جاري تحميل المنتجات...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-slate-500">لا توجد منتجات مسجلة حالياً. استخدم النموذج لإضافة أول منتج!</div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between bg-slate-950/60 border border-slate-800/80 p-4 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <img src={product.images} alt={product.name} className="w-16 h-16 object-cover rounded-xl border border-slate-800" />
                      <div>
                        <h3 className="text-base font-bold text-white">{product.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-indigo-400 font-black text-sm">${product.price.toFixed(2)}</span>
                          <span className="text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800">المخزن: {product.stock}</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 text-xs font-bold px-3.5 py-2 rounded-xl transition duration-200 cursor-pointer"
                    >
                      حذف 🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* قسم طلبات العملاء */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6">📋 طلبات العملاء الواردة ({orders.length})</h2>

          {loadingOrders ? (
            <div className="text-center py-10 text-slate-400">جاري تحميل الطلبات...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-10 text-slate-500">لا توجد طلبات شراء حتى الآن.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm text-slate-300">
                <thead className="border-b border-slate-800 text-slate-400">
                  <tr>
                    <th className="pb-3 pr-4">اسم العميل</th>
                    <th className="pb-3">رقم الهاتف</th>
                    <th className="pb-3">العنوان</th>
                    <th className="pb-3">الإجمالي</th>
                    <th className="pb-3">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-950/40">
                      <td className="py-4 pr-4 font-bold text-white">{order.name}</td>
                      <td className="py-4 text-slate-300">{order.phone}</td>
                      <td className="py-4 text-slate-400">{order.address}</td>
                      <td className="py-4 text-indigo-400 font-black">${order.total.toFixed(2)}</td>
                      <td className="py-4 text-xs text-slate-500">{new Date(order.createdAt).toLocaleString('ar-EG')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}