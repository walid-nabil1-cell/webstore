// app/page.tsx
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

interface CartItem extends Product {
  quantity: number
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching products:", err)
        setLoading(false)
      })
  }, [])

  // دالة إضافة المنتج للسلة وفتح القائمة الجانبية تلقائياً
  const addToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
    setIsCartOpen(true)
  }

  const removeFromCart = (id: string) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    )
  }

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const totalItemsCount = cart.reduce((total, item) => total + item.quantity, 0)

  // دالة الانتقال لصفحة الدفع مع حفظ السلة
  const handleCheckoutRedirect = (e: React.MouseEvent) => {
    e.preventDefault()
    localStorage.setItem("cart_items", JSON.stringify(cart))
    localStorage.setItem("cart_total", totalPrice.toString())
    window.location.href = "/checkout"
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white" dir="rtl">
      {/* هيدر المتجر */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            متجري الإلكتروني 🛍️
          </h1>
          <nav className="hidden md:flex space-x-6 space-x-reverse text-sm font-medium text-slate-300 items-center">
            <span className="hover:text-indigo-400 cursor-pointer transition">الرئيسية</span>
            <a href="/admin" className="bg-slate-800 hover:bg-slate-700 text-indigo-400 px-3 py-1.5 rounded-xl transition">
              لوحة التحكم ⚙️
            </a>
          </nav>
          
          <button 
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition shadow-lg shadow-indigo-600/20 flex items-center gap-2 cursor-pointer"
          >
            🛒 سلة المشتريات
            {totalItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                {totalItemsCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold tracking-tight mb-3 text-white">
            أحدث المنتجات المميزة
          </h2>
          <p className="text-slate-400 text-lg">تسوق أفضل المنتجات التقنية بأعلى جودة وأفضل الأسعار</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 text-lg">جاري تحميل المنتجات...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-lg">
            لا توجد منتجات مضافة حالياً. اذهب إلى <a href="/admin" className="text-indigo-400 underline">لوحة التحكم</a> لإضافة منتجات جديدة!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {products.map((p) => (
              <div key={p.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col">
                <img src={p.images} alt={p.name} className="w-full h-48 object-cover rounded-xl mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">{p.name}</h2>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-grow">{p.description}</p>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-800">
                  <span className="text-indigo-400 font-black text-xl">${p.price.toFixed(2)}</span>
                  <button 
                    onClick={(e) => addToCart(p, e)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition cursor-pointer shadow-md shadow-indigo-600/30"
                  >
                    إضافة للسلة 🛒
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* سلة المشتريات الجانبية */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="absolute inset-y-0 left-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-slate-900 border-r border-slate-800 p-6 flex flex-col shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="text-xl font-bold text-white">🛒 سلة المشتريات ({totalItemsCount})</h3>
                <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-white font-bold cursor-pointer">✕</button>
              </div>

              <div className="flex-grow overflow-y-auto py-4 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-20 text-slate-500">سلة المشتريات فارغة.</div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
                      <div className="flex items-center gap-3">
                        <img src={item.images} alt={item.name} className="w-14 h-14 object-cover rounded-xl" />
                        <div>
                          <h4 className="text-sm font-bold text-white">{item.name}</h4>
                          <span className="text-xs text-indigo-400 font-semibold">${item.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center justify-center font-bold cursor-pointer">-</button>
                        <span className="text-sm font-bold text-white w-5 text-center">{item.quantity}</span>
                        <button onClick={(e) => addToCart(item, e)} className="w-7 h-7 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center justify-center font-bold cursor-pointer">+</button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="pt-4 border-t border-slate-800 space-y-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-slate-300">الإجمالي:</span>
                    <span className="text-indigo-400">${totalPrice.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={handleCheckoutRedirect}
                    className="block text-center w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-2xl shadow-lg transition cursor-pointer"
                  >
                    إتمام الشراء 💳
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-slate-500 text-sm mt-20">
        <p>جميع الحقوق محفوظة للمتجر الإلكتروني 2026 ©</p>
      </footer>
    </div>
  )
}