// app/api/orders/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, phone, address, total, items } = body

    if (!name || !phone || !address) {
      return NextResponse.json({ error: 'الرجاء إكمال جميع البيانات المطلوبة' }, { status: 400 })
    }

    const newOrder = await prisma.order.create({
      data: {
        name,
        phone,
        address,
        total: parseFloat(total || 0),
        items: JSON.stringify(items || []),
      },
    })

    return NextResponse.json(newOrder, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء حفظ الطلب' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: 'خطأ في جلب الطلبات' }, { status: 500 })
  }
}