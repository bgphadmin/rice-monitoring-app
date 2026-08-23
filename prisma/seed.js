const { PrismaClient } = require("@prisma/client")
const { faker } = require("@faker-js/faker")

const prisma = new PrismaClient()

async function main() {
  const employees = Array.from({ length: 50 }).map((_, i) => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    employeeId: `EMP${String(i + 101).padStart(3, "0")}`,
    phone: faker.helpers.replaceSymbols("09#########"),
    active: true,
  }))

  await prisma.employee.createMany({
    data: employees,
    skipDuplicates: true,
  })

  console.log("✅ Seeded 50 employees")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


// // eslint-disable-next-line @typescript-eslint/no-require-imports
// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();
// // eslint-disable-next-line @typescript-eslint/no-require-imports
// // const userData = require("./userData.json");
// // eslint-disable-next-line @typescript-eslint/no-require-imports
// const data = require("./distributionData.json");

// async function main() {
//   for (const datum of data) {
//     await prisma.employeeDistribution.create({
//       data: datum,
//     });
//   }
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
