// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // مسح البيانات القديمة إن وجدت
  await prisma.product.deleteMany()

  // إضافة منتجات تجريبية
  await prisma.product.createMany({
    data: [
      {
        name: 'سماعة لاسلكية عازلة للضوضاء',
        description: 'سماعة رأس احترافية بصوت نقي وبطارية تدوم حتى 30 ساعة.',
        price: 149.99,
        images: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        stock: 15,
      },
      {
        name: 'ساعة ذكية رياضية',
        description: 'ساعة مقاومة للماء مع تتبع للياقة البدنية ونبضات القلب.',
        price: 89.50,
        images: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        stock: 25,
      },
      {
        name: 'حقيبة ظهر للابتوب',
        description: 'حقيبة خفيفة ومقاومة للماء تتسع للابتوب بمقاس 15.6 بوصة.',
        price: 45.00,
        images: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
        stock: 40,
      },
    ],
  })

  console.log('✅ تم إضافة البيانات التجريبية بنجاح!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })