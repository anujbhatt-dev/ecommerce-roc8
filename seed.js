// import { PrismaClient } from '@prisma/client';
// import { faker } from '@faker-js/faker';

// const prisma = new PrismaClient();

// async function main() {
//   const categories = [];

//   for (let i = 0; i < 100; i++) {
//     categories.push({ name: faker.commerce.department() });
//   }

//   await prisma.category.createMany({ data: categories });
// }

// main()
//   .catch(e => console.error(e))
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
