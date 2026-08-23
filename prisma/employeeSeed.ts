import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  const employees = Array.from({ length: 50 }).map((_, i) => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    employeeId: `EMP${String(i + 1).padStart(3, "0")}`, // EMP001 → EMP050
    phone: faker.helpers.replaceSymbols("09#########"), // PH-style mobile number
    active: true,
  }));

  await prisma.employee.createMany({
    data: employees,
    skipDuplicates: true,
  });

  console.log("✅ Seeded 50 employees with realistic names and phone numbers");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });