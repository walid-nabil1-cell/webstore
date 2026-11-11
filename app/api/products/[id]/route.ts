// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // فك الـ params بطريقة آمنة ومتوافقة مع إصدارات Next.js الحديثة
    const { id } = await params
    console.log("Deleting product with ID:", id)

    if (!id) {
      return NextResponse.json({ error: 'معرف المنتج غير موجود' }, { status: 400 })
    }

    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'تم حذف المنتج بنجاح' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'فشل في حذف المنتج من قاعدة البيانات' }, { status: 500 })
  }
}