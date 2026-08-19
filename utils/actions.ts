"use server";

import db from "@/utils/db";
import { riceSchema } from "./validation/riceSchema";
import { distributionSchema } from "./validation/distributionSchema";
import { revalidatePath } from "next/cache";
import { userSchema } from "./validation/userSchema";
import { auth } from "@clerk/nextjs/server";
import verifyUser from "./userValidation";
import { ZodError } from "zod";
import { stockLogSchema } from "./validation/stockLogSchema";
import { SortingState } from "@tanstack/react-table";
import { Prisma } from "@prisma/client";

export const renderError = (error: unknown): { message: string } => {
  if (error instanceof ZodError) {
    console.log("ZOD Error:", error);
    return {
      message: JSON.stringify([
        { message: "Error: " + JSON.parse(error.message)[0].message || error.message },
        { result: "error" },
      ])
    };
  } else if (error instanceof Error) {
    console.log("Error: ", error);
    return {
      message: JSON.stringify([
        { message: "Error: " + error.message },
        { result: "error" },
      ])
    };
  } else {
    console.log("Error:", error);
    return {
      message: JSON.stringify([
        { message: "Something went wrong." },
        { result: "error" },
      ])
    };
  }
};

/* ------------------ Rice Actions ------------------ */
export async function getRiceItems() {
  return db.rice.findMany({ 
    include: {
      addedBy: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function getRiceItemsPerPage(pageIndex = 0, pageSize = 10) {
  const [rows, total] = await Promise.all([
    db.rice.findMany({
      skip: pageIndex * pageSize,
      take: pageSize,
      orderBy: { updatedAt: "desc" },
      include: { addedBy: true },
    }),
    db.rice.count(),
  ])
   // 🔑 Convert Decimal → number here
  const safeRows = rows.map((record) => ({
    id: record.id,
    name: record.name,
    stockKg: record.stockKg,
    reorderLevel: record.reorderLevel,
    comment: record.comment ?? null,
    addedBy: {
      firstName: record.addedBy.firstName,
      lastName: record.addedBy.lastName,
    }
  }))
  
  return { safeRows, total };
}; 


// get rice items with stock and total stock
export async function getRiceItemsWithStock() {
  const riceItems = await db.rice.findMany({
    select: { id: true, name: true, stockKg: true, reorderLevel: true },
    orderBy: { name: "asc" },
  });
  const converted = riceItems.map(r => ({
    ...r,
    stockKg: r.stockKg,
    reorderLevel: r.reorderLevel,
  }));
  const totalStock = converted.reduce((sum, r) => sum + r.stockKg, 0);
  return { riceItems: converted, totalStock };
}

// get rice options
export async function getRiceOptions() {
  return await db.rice.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

// get a rice item
export async function getRiceItem(id: string){
  return await db.rice.findUnique ({ 
      select: { name: true },
      where: { id } 
    });
}

export const addRiceItem = async (
  prevState: unknown,
  formData: FormData
): Promise<{ message: string }> => {
  const { userId } = auth();
  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = riceSchema.parse(rawData);
    const inventory = await db.rice.create({
      data: {
        ...validatedFields,
        addedById: userId || "", 
      },
      include: {
        addedBy: true,
      },
    });

    revalidatePath("/inventory");
    return {
      message: JSON.stringify([
        { message: "Rice item added successfully" },
        { result: "success" },
        { inventory },
      ]),
    };
  } catch (error: unknown) {

    if ((error as Error & { code: string }).code === "P2002") {
      return {
        message: JSON.stringify([
          { message: "Rice variety already exists" },
          { result: "error" },
        ])
      };
    } else {
      return renderError(error);
    }
  }
};

export async function editRiceItemAction(id: string, formData: FormData): Promise<{ message: string }> {
  const { userId } = auth();
  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = riceSchema.parse(rawData);
    const inventory = await db.rice.update({
      where: { id},
      data: { ...validatedFields, addedById: userId || "" },
      include: {
        addedBy: true,
      },
    });

    revalidatePath("/inventory");
    return {
      message: JSON.stringify([
        { message: "Rice item updated successfully" },
        { result: "success" },
        { inventory },
      ]),
    };
  } catch (err: unknown) {
    console.error("Update error:", err);
    return renderError(err);
  }
}

export async function deleteRiceItemAction(id: string): Promise<{ message: string }> {
  try {
    await db.rice.delete({
      where: { id },
    });
    revalidatePath("/inventory");
    return {
      message: JSON.stringify([
        { message: "Rice item deleted successfully" },
        { result: "success" },
      ])
    };
  } catch (err: unknown) {
    if ((err as Error & { code: string }).code === "P2003") {
      return {
        message: JSON.stringify([
          { message: "Unable to delete rice item as it is in use in Rice Distributions" },
          { result: "error" },
        ])
      } 
    } else {
      return renderError(err);
    } 
  }
}


/* ------------------ User Actions ------------------ */
export async function getUsers() {
  return db.user.findMany({ orderBy: { createdAt: "desc" } });
}

export async function editUserItemAction(id: string, formData: FormData): Promise<{ message: string }> {
  const isSuperUser = await verifyUser("SUPERUSER");

  if (!isSuperUser) {
    return { message: '[{"message": "You are not authorized to update user details"}, {"result": "error"} ]' };
  }

  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = userSchema.parse(rawData);
    await db.user.update({
      where: { id },
      data: { ...validatedFields },
    });
    revalidatePath("/inventory");
    return { message: '[{"message": "User details updated successfully"}, {"result": "success"} ]' };
  } catch (err: unknown) {
    console.error("Update error:", err);
    return renderError(err);
  }
}



/* ------------------ Distribution Actions ------------------ */
export async function getDistributions() {
  return db.employeeDistribution.findMany({
    include: {
      rice: true,
      createdBy: true,
    },
    orderBy: {
      dateGiven: "desc",
    },
  })
}

interface DistributionQuery {
  pageIndex: number 
  pageSize?: number
  q?: string
  startDate?: string
  endDate?: string
  sort?: SortingState
}

export async function getDistributionsPerPage({
  pageIndex = 0,
  pageSize = 10,
  q,
  startDate,
  endDate,
  sort,
}: DistributionQuery) {

  const where: Prisma.EmployeeDistributionWhereInput = {}

  // Build a DateTimeFilter separately
  const dateFilter: Prisma.DateTimeFilter = {}
  if (startDate) {
    dateFilter.gte = new Date(startDate)
  }
  if (endDate) {
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)
    dateFilter.lte = end
  }
  if (Object.keys(dateFilter).length > 0) {
    where.dateGiven = dateFilter
  }  

  if (q) {
    where.OR = [
      { firstName: { contains: q, mode: "insensitive" } },
      { lastName: { contains: q, mode: "insensitive" } },
      { rice: { name: { contains: q, mode: "insensitive" } } },
    ]
  }

const orderBy: Prisma.EmployeeDistributionOrderByWithRelationInput =
  sort && sort.length
    ? sort[0].id === "rice.name"
      ? { rice: { name: sort[0].desc ? "desc" : "asc" } }
      : { [sort[0].id]: (sort[0].desc ? "desc" : "asc") as Prisma.SortOrder }
    : { dateGiven: "desc" }

  const [rows, total] = await Promise.all([
    db.employeeDistribution.findMany({
      skip: pageIndex * pageSize,
      take: pageSize,
      orderBy,
      where,
      include: { createdBy: true, rice: true },
    }),
    db.employeeDistribution.count({ where }),
  ])
   // 🔑 Convert Decimal → number here
  const safeRows = rows.map((record) => (
    {
      ...record,
      dateGiven: record.dateGiven.toISOString(),
      rice: { name: record.rice.name, id: record.rice.id },
      createdBy: {
        firstName: record.createdBy.firstName,
        lastName: record.createdBy.lastName,
    },
  }))
  return { safeRows, total };
};


export async function addDistributionAction(
  prevState: unknown,
  formData: FormData
): Promise<{ message: string }> {
  const { userId } = auth();

  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = distributionSchema.parse(rawData);
    const riceRecord = await db.rice.findUnique({
      where: { id: validatedFields.riceId },
    });

        // 🔑 Validation: prevent removing more than availables
    if ( riceRecord && validatedFields.quantityKg > riceRecord.stockKg) {
      return {
        message: JSON.stringify([
          { message: "Insufficient rice stock (" + riceRecord.name + ") : Available: " + riceRecord.stockKg + " kg" },
          { result: "error" },
        ]),
      };
    }

    if (!riceRecord) {
      return { message: '[{"message": "Rice variety not found"}, {"result": "error"}]' };
    }

    // 🔑 Transaction: create distribution + update rice stock
    const result = await db.$transaction(async (tx) => {
      const distribution = await tx.employeeDistribution.create({
        data: {
          firstName: validatedFields.firstName,
          lastName: validatedFields.lastName,
          employeeId: validatedFields.employeeId,
          riceId: validatedFields.riceId,
          quantityKg: validatedFields.quantityKg,
          comment: validatedFields.comment,
          dateGiven: new Date(`${validatedFields.dateGiven}T00:00:00.000Z`),
          createdById: userId || "",
        },
        include: {
          rice: true,
          createdBy: true,
        },
      });

      await tx.rice.update({
        where: { id: validatedFields.riceId },
        data: {
          stockKg: {
            decrement: validatedFields.quantityKg, // distribution always reduces stock
          },
        },
      });

      return distribution;
    });

    revalidatePath("/distribution");
    return {
      message: JSON.stringify([
        { message: "Distribution added successfully" },
        { result: "success" },
        { distribution: result },
      ]),
    };
  } catch (error: unknown) {
    console.error("Error adding distribution:", error);
    return renderError(error);
  }
}

export async function editDistributionAction(id: string, formData: FormData): Promise<{ message: string }> {
  const { userId } = auth();
  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = distributionSchema.parse(rawData);
        const result = await db.$transaction(async (tx) => {
      // Get the existing distribution
      const existing = await tx.employeeDistribution.findUnique({
        where: { id },
      });
      if (!existing) throw new Error("Distribution not found");

      // Calculate stock adjustment
      const oldQty = existing.quantityKg;
      const newQty = validatedFields.quantityKg;
      const diff = newQty - oldQty;

      // Check rice stock before update
      const rice = await tx.rice.findUnique({ where: { id: validatedFields.riceId } });
      if (!rice) throw new Error("Rice variety not found");

      const newStock = rice.stockKg - diff;
      if (newStock < 0) {
        throw new Error(`Insufficient rice stock (${rice.name}). Available: ${rice.stockKg} kg`);
      }

      // Update distribution
      const updated = await tx.employeeDistribution.update({
        where: { id },
        data: {
          firstName: validatedFields.firstName,
          lastName: validatedFields.lastName,
          employeeId: validatedFields.employeeId,
          quantityKg: newQty,
          comment: validatedFields.comment,
          dateGiven: new Date(validatedFields.dateGiven),
          riceId: validatedFields.riceId,
          createdById: userId || "",
        },
        include: { createdBy: true, rice: true },
      });

      // Adjust rice stock
      await tx.rice.update({
        where: { id: validatedFields.riceId },
        data: {
          stockKg: { decrement: diff }, // if diff positive, subtract more; if negative, add back
        },
      });
      return updated;
    });

    revalidatePath("/distribution");
    return {
      message: JSON.stringify([
        { message: "Rice distribution updated successfully" },
        { result: "success" },
        { distribution: result },
      ]),
    };
  } catch (err: unknown) {
    console.error("Update error:", err);
    return renderError(err);
  }
}

export async function deleteDistributionItemAction(id: string): Promise<{ message: string }> {
  try {
    const result = await db.$transaction(async (tx) => {
      const existing = await tx.employeeDistribution.findUnique({
        where: { id },
      });
      if (!existing) throw new Error("Distribution not found");

      const rice = await tx.rice.findUnique({ where: { id: existing.riceId } });
      if (!rice) throw new Error("Rice variety not found");

      // For safety only in case of data corruption
      const newStock = rice.stockKg + existing.quantityKg;
      if (newStock < 0) {
        throw new Error(`Invalid rice stock (${rice.name}) deletion. Current stock: ${rice.stockKg} kg`);
      }

      // Delete distribution
      await tx.employeeDistribution.delete({ where: { id } });

      // Restore rice stock
      await tx.rice.update({
        where: { id: existing.riceId },
        data: {
          stockKg: { increment: existing.quantityKg },
        },
      });

      return existing;
    });
    revalidatePath("/inventory");
    return {
      message: JSON.stringify([
        { message: "Rice distribution deleted successfully" },
        { result: "success" },
        { distribution: result },
      ])
    };
  } catch (err: unknown) {
      return renderError(err);
  }
}

export async function getCurrentMonthDistributionTotal() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const result = await db.employeeDistribution.aggregate({
    _sum: { quantityKg: true },
    where: {
      dateGiven: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  });

  return result._sum.quantityKg ?? 0;
}

export async function getDailyDistributionTotals() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const distributions = await db.employeeDistribution.findMany({
    where: {
      dateGiven: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    select: { dateGiven: true, quantityKg: true },
  });

  // Aggregate by day
  const dailyTotals: Record<string, number> = {};
  distributions.forEach((d) => {
    const day = d.dateGiven.toISOString().split("T")[0]; // YYYY-MM-DD
    dailyTotals[day] = (dailyTotals[day] || 0) + d.quantityKg;
  });

  return Object.entries(dailyTotals).map(([date, total]) => ({
    date,
    total,
  }));
}

export async function getMonthlyDistributionTotals() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);

  const distributions = await db.employeeDistribution.findMany({
    where: {
      dateGiven: {
        gte: startOfYear,
        lte: endOfYear,
      },
    },
    select: { dateGiven: true, quantityKg: true },
  });

  const monthlyTotals: number[] = Array(12).fill(0);
  distributions.forEach((d) => {
    const monthIndex = d.dateGiven.getMonth();
    monthlyTotals[monthIndex] += d.quantityKg;
  });

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  // Build cumulative totals
  let runningTotal = 0;
  return monthNames.map((name, i) => {
    runningTotal += monthlyTotals[i];
    return {
      month: name,
      total: monthlyTotals[i],
      cumulative: runningTotal,
    };
  });
}


export async function getDashboardMetrics() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  // Rice stock
  const riceItems = await db.rice.findMany({
    select: { name: true, stockKg: true, reorderLevel: true },
  });
  const totalStock = riceItems.reduce((sum, r) => sum + r.stockKg, 0);

  // Current month distribution total
  const distributionTotal = await db.employeeDistribution.aggregate({
    _sum: { quantityKg: true },
    where: {
      dateGiven: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  });

  return {
    riceItems,
    totalStock,
    monthlyTotal: distributionTotal._sum.quantityKg ?? 0,
  };
}



/* ------------------ Stock Logs Actions ------------------ */


// app/actions/getStockLogs.ts
export async function getStockLogs(pageIndex = 0, pageSize = 10) {
  const [rows, total] = await Promise.all([
    db.riceStockLog.findMany({
      skip: pageIndex * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: { rice: true, createdBy: true },
    }),
    db.riceStockLog.count(),
  ])

   // 🔑 Convert Decimal → number here
  const safeRows = rows.map((record) => ({
    id: record.id,
    riceId: record.riceId,
    quantityKg: record.quantityKg.toNumber(), // ✅ plain number
    action: record.action,
    comment: record.comment ?? null,
    createdAt: record.createdAt.toISOString(),
    createdById: record.createdById,
    rice: record.rice,
    createdBy: record.createdBy,
  }))

  return { safeRows, total }
}


export async function getStockLogs2({
  riceId,
  action,
  startDate,
  endDate,
  skip = 0,
  take = 10,
}: {
  riceId?: string;
  action?: "ADD" | "REMOVE";
  startDate?: Date;
  endDate?: Date;
  skip?: number;
  take?: number;
}) {
  const stockLogs = db.riceStockLog.findMany({
    where: { 
      riceId, 
      action,
      createdAt: {
        gte: startDate,
        lte: endDate,
      }, 
    },
    include: {
      createdBy: true,
      rice: true,
    },
    orderBy: { createdAt: "desc" },
    skip,
    take,
  })
  const stocks = ( await stockLogs).map((log) => ({ ...log, createdAt: log.createdAt.toISOString(), quantityKg: log.quantityKg.toNumber() }));

  const total = await db.riceStockLog.count({
    where: {
      riceId,
      action,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
  return { stocks, total };
}


export async function addStockLogAction(
  prevState: unknown,
  formData: FormData
): Promise<{ message: string }> {
  const { userId } = auth();

  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = stockLogSchema.parse(rawData);
    const riceRecord = await db.rice.findUnique({
      where: { id: validatedFields.riceId },
    });

    if (!riceRecord) {
      return { message: '[{"message": "Rice variety not found"}, {"result": "error"}]' };
    }

    // 🔑 Validation: prevent removing more than available
    if (
      validatedFields.action === "REMOVE" &&
      validatedFields.quantityKg > riceRecord.stockKg
    ) {
      return {
        message: JSON.stringify([
          { message: "Cannot remove more than current stock" },
          { result: "error" },
        ]),
      };
    }

    // 🔑 Transaction: create log + update rice stock
    const result = await db.$transaction(async (tx) => {
      const stockLog = await tx.riceStockLog.create({
        data: {
          action: validatedFields.action,
          quantityKg: validatedFields.quantityKg,
          riceId: validatedFields.riceId,
          comment: validatedFields.comment,
          createdById: userId || "",
        },
        include: {
          rice: true,
          createdBy: true,
        },
      });

      const adjustment =
        validatedFields.action === "ADD"
          ? validatedFields.quantityKg
          : -validatedFields.quantityKg;

      await tx.rice.update({
        where: { id: validatedFields.riceId },
        data: {
          stockKg: {
            increment: adjustment,
          },
        },
      });

      return stockLog;
    });

    revalidatePath("/stockLog");
    return {
      message: JSON.stringify([
        { message: "Stock log added successfully" },
        { result: "success" },
        { result: result },
      ]),
    };
  } catch (error: unknown) {
    console.error("Error adding distribution:", error);
    return renderError(error);
  }
}