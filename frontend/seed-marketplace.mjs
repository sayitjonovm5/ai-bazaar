import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'seed@example.com',
        name: 'Toshkent Ta\'minot',
        password: 'hashed_password_dummy',
        profilePicture: null
      }
    });
  }

  await prisma.supplierOffer.create({
    data: {
      productName: 'Avtobenzin A-80',
      companyName: 'O\'zbekneftgaz AJ',
      price: 9300000,
      phoneNumber: '+998 90 123 45 67',
      description: 'Yuqori sifatli avtobenzin A-80. Toshkent shahrida yetkazib berish bepul.',
      imageUrl: '/images/products/fuel.jpg',
      userId: user.id
    }
  });

  await prisma.supplierOffer.create({
    data: {
      productName: 'Paxta',
      companyName: 'Agro Export MCHJ',
      price: 14500000,
      phoneNumber: '+998 90 987 65 43',
      description: 'Sifatli paxta tolasini ulgurji narxlarda xarid qiling. Qashqadaryo viloyati bo\'ylab.',
      imageUrl: '/images/products/cotton.jpg',
      userId: user.id
    }
  });

  await prisma.supplierOffer.create({
    data: {
      productName: 'Sement (Ohangaronsement)',
      companyName: 'Qurilish Mollari MCHJ',
      price: 650000,
      phoneNumber: '+998 93 111 22 33',
      description: 'Yuqori sifatli M-400 markali sement. Qoplangan (50kg) yoki quyma holda. Qurilish tashkilotlari bilan uzoq muddatli shartnomalar tuzamiz.',
      imageUrl: '/images/products/cement.jpg',
      userId: user.id
    }
  });

  console.log("Seeded example products!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
