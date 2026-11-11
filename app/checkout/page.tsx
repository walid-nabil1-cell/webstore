// app/checkout/page.tsx
"use client"

import { useState, useEffect } from "react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  images: string
}

export default function CheckoutPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [totalPrice, setTotalPrice] = useState(0)

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  })

  useEffect(() => {
    const savedCart = localStorage.getItem("cart_items")
    const savedTotal = localStorage.getItem("cart_total")
    if (savedCart) setCartItems(JSON.parse(savedCart))
    if (savedTotal) setTotalPrice(parseFloat(savedTotal))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.phone || !formData.address) {
      alert("الرجاء إكمال جميع بيانات الشحن")
      return
    }

    if (cartItems.length === 0) {
      alert("سلة المشتريات فارغة!")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          total: totalPrice,
          items: cartItems,
        }),
      })

      if (res.ok) {
        localStorage.removeItem("cart_items")
        localStorage.removeItem("cart_total")
        setSubmitted(true)
      } else {
        alert("حدث خطأ أثناء إرسال الطلب")
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6" dir="rtl">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center max-w-md w-full shadow-2xl">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-2">تم طلبك بنجاح!</h2>
          <p className="text-slate-400 text-sm mb-6">شكراً لتسوقك معنا. تم تسجيل طلبك والدفع عند الاستلام وسنتواصل معك قريباً.</p>
          <a href="/" className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-2xl transition">
            العودة للمتجر 🛍️
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8" dir="rtl">
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ملخص الطلب */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col">
          <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-3">📦 ملخص الطلب</h2>
          <div className="flex-grow overflow-y-auto space-y-3 max-h-60">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <span className="text-slate-300">{item.name} (x{item.quantity})</span>
                <span className="text-indigo-400 font-bold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 pt-4 mt-4 flex justify-between items-center text-lg font-black">
            <span>الإجمالي الكلي:</span>
            <span className="text-indigo-400">${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* نموذج بيانات الشحن */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <h1 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-3">💳 بيانات الشحن</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">الاسم الكامل *</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="محمد أحمد" 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">رقم الهاتف *</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="01012345678" 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">عنوان الشحن بالتفصيل *</label>
              <textarea 
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="المدينة، الشارع، رقم الحائط..." 
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-2xl shadow-lg transition mt-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? "جاري إرسال الطلب..." : "تأكيد الطلب الآن 🚀"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}