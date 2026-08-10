"use server";

import db from "@/utils/db";
import { riceSchema } from "./validation/riceSchema";
import { distributionSchema } from "./validation/distributionSchema";
import { revalidatePath } from "next/cache";
import { userSchema } from "./validation/userSchema";
import { auth } from "@clerk/nextjs/server";
import verifyUser from "./userValidation";

/* ------------------ Rice Actions ------------------ */
export const renderError = (error: unknown): { message: string, result: string } => {
  return {
    message: error instanceof Error ? error.message : 'An error occurred',
    result: 'error',
  };
};

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
  } catch (error: any) {
    console.error("Error adding distribution:", error);
    return renderError(error);
  }
};

export async function editRiceItemAction(id: string, formData: FormData): Promise<{ message: string }> {
  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = riceSchema.parse(rawData);
    await db.rice.update({
      where: { id },
      data: { ...validatedFields },
    });

    revalidatePath("/inventory");
    return { message: '[{"message": "Rice item updated successfully"}, {"result": "success"} ]' };
    // return { success: true, message: "Rice item updated successfully" };
  } catch (err: any) {
    console.error("Update error:", err);
    return renderError(err);
    // return { success: false, message: "Failed to update rice item" };
  }
}


export async function deleteRiceItemAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ message: string }> {
  try {
    const raw = Object.fromEntries(formData) as Record<string, any>;
    const id = raw.id as string | undefined;

    if (!id) {
      return { message: '[{"message": "Missing id"}, {"result": "error"}]' };
    }

    await db.rice.delete({
      where: { id },
    });
    revalidatePath("/inventory");
    return { message: '[{"message": "Rice item deleted successfully"}, {"result": "success"}]' };
  } catch (err: any) {
    console.error("Delete error:", err);
    return renderError(err);
  }
}

/* ------------------ User Actions ------------------ */
export async function getUsers() {
  return db.user.findMany({ orderBy: { createdAt: "desc" } });
}

// export async function addUser({
//   email,
//   password,
//   firstName,
//   lastName,
//   role,
//   employeeId,
// }: {
//   email: string;
//   password: string;
//   firstName: string;
//   lastName: string;
//   role: "ADMIN" | "USER";
//   employeeId: string;
// }) {
//   return db.user.create({
//     data: { email, password, firstName, lastName, role, employeeId },
//   });
// }


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
    // return { success: true, message: "Rice item updated successfully" };
  } catch (err: any) {
    console.error("Update error:", err);
    return renderError(err);
    // return { success: false, message: "Failed to update rice item" };
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
      where: { name: validatedFields.riceName },
    });

    if (!riceRecord) {
      return { message: '[{"message": "Rice variety not found"}, {"result": "error"}]' };
    }

    const distribution = await db.employeeDistribution.create({
      data: {
        firstName: validatedFields.firstName,
        lastName: validatedFields.lastName,
        employeeId: validatedFields.employeeId,
        riceId: riceRecord.id,
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
  } catch (error: any) {
    console.error("Error adding distribution:", error);
    return renderError(error);
  }
}

// export async function addDistribution({
//   employeeId,
//   riceId,
//   quantityKg,
//   createdById,
//   imageUrl,
// }: {
//   employeeId: string;
//   riceId: string;
//   quantityKg: number;
//   createdById: string;
//   imageUrl?: string;
// }) {
//   const data = {
//     employeeId,
//     riceId,
//     quantityKg,
//     createdById,
//     ...(imageUrl ? { imageUrl } : {}),
//   };

//   return db.employeeDistribution.create({ data });
// }