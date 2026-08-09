-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rice" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stockKg" INTEGER NOT NULL,
    "reorderLevel" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "addedById" TEXT NOT NULL,

    CONSTRAINT "Rice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeDistribution" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "riceId" TEXT NOT NULL,
    "quantityKg" INTEGER NOT NULL,
    "dateGiven" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imageUrl" TEXT,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "EmployeeDistribution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Rice_name_key" ON "Rice"("name");

-- AddForeignKey
ALTER TABLE "Rice" ADD CONSTRAINT "Rice_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeDistribution" ADD CONSTRAINT "EmployeeDistribution_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeDistribution" ADD CONSTRAINT "EmployeeDistribution_riceId_fkey" FOREIGN KEY ("riceId") REFERENCES "Rice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeDistribution" ADD CONSTRAINT "EmployeeDistribution_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
