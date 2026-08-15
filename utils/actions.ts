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
        { message: "Catch Error: " + error.message },
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

// get rice items with stock and total stock
export async function getRiceItemsWithStock() {
  const riceItems = await db.rice.findMany({
    select: { id: true, name: true, stockKg: true, reorderLevel: true },
    orderBy: { name: "asc" },
  });
  const converted = riceItems.map(r => ({
    ...r,
    stockKg: r.stockKg.toNumber(),   // convert Decimal → number
    reorderLevel: r.reorderLevel.toNumber(),
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

    if (!riceRecord) {
      return { message: '[{"message": "Rice variety not found"}, {"result": "error"}]' };
    }

    const distribution = await db.employeeDistribution.create({
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

    revalidatePath("/distribution");
    return {
      message: JSON.stringify([
        { message: "Distribution added successfully" },
        { result: "success" },
        { distribution },
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
    // Convert dateGiven string into a Date object
    const dateGivenValue = validatedFields.dateGiven
      ? new Date(validatedFields.dateGiven)
      : undefined;

    const distribution = await db.employeeDistribution.update({
      where: { id},
      data: { ...validatedFields,
              dateGiven: dateGivenValue, 
              createdById: userId || "",
              riceId: validatedFields.riceId 
            },
      include: {
        createdBy: true,
        rice: true
      },
    });

    revalidatePath("/distribution");
    return {
      message: JSON.stringify([
        { message: "Rice distribution updated successfully" },
        { result: "success" },
        { distribution },
      ]),
    };
  } catch (err: unknown) {
    console.error("Update error:", err);
    return renderError(err);
  }
}

export async function deleteDistributionItemAction(id: string): Promise<{ message: string }> {
  try {
    await db.employeeDistribution.delete({
      where: { id },
    });
    revalidatePath("/inventory");
    return {
      message: JSON.stringify([
        { message: "Rice distribution deleted successfully" },
        { result: "success" },
      ])
    };
  } catch (err: unknown) {
      return renderError(err);
  }
}

/* ------------------ Stock Logs Actions ------------------ */

export async function getStockLogs() {
  return db.riceStockLog.findMany({ 
    include: {
      rice: true,
      createdBy: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
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