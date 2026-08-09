// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// eslint-disable-next-line @typescript-eslint/no-require-imports
// const userData = require("./userData.json");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const data = require("./riceData.json");

async function main() {
  for (const datum of data) {
    await prisma.rice.create({
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
