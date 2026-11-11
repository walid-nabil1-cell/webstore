// app/api/products/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'خطأ في جلب المنتجات' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = formData.get('price') as string
    const stock = formData.get('stock') as string
    const imageFile = formData.get('image') as File | null

    if (!name || !price || !imageFile) {
      return NextResponse.json({ error: 'الرجاء ملء الحقول الإجبارية وإرفاق الصورة' }, { status: 400 })
    }

    // التأكد من وجود مجلد public/uploads وإنشاؤه تلقائياً لو مش موجود
    const uploadDir = path.join(process.cwd(), 'public/uploads')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // حفظ الصورة محلياً
    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const filename = `${Date.now()}-${imageFile.name.replace(/\s/g, '_')}`
    const filepath = path.join(uploadDir, filename)
    
    await writeFile(filepath, buffer)
    const imagePath = `/uploads/${filename}`

    const newProduct = await prisma.product.create({
      data: {
        name,
        description: description || '',
        price: parseFloat(price),
        images: imagePath,
        stock: parseInt(stock) || 0,
      },
    })

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'خطأ أثناء إضافة المنتج' }, { status: 500 })
  }
}