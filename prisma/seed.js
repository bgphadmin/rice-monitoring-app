// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// eslint-disable-next-line @typescript-eslint/no-require-imports
// const userData = require("./userData.json");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const data = require("./distributionData.json");

async function main() {
  for (const datum of data) {
    await prisma.employeeDistribution.create({
      data: datum,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
