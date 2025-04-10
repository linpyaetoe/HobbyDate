import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const categories = [
    { name: 'Creative & Arts' },
    { name: 'Games & Pop Culture' },
    { name: 'Wellness & Movement' },
    { name: 'Food & Lifestyle' },
    { name: 'Curious Minds' }
  ];

  console.log('Seeding categories...');
  
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: { name: category.name }
    });
  }

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 