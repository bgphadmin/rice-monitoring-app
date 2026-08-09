"use server";

import db from "@/utils/db";
import { riceSchema } from "./validation/riceSchema";
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
  return db.rice.findMany({ orderBy: { name: "asc" } });
}

export const addRiceItem = async (
  prevState: unknown,
  formData: FormData
): Promise<{ message: string }> => {
  const { userId } = auth();

  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = riceSchema.parse(rawData);
    await db.rice.create({
      data: {
        ...validatedFields,
        addedById: userId || "", 
      },
    });
    revalidatePath('/inventory');
    return { message: '[{"message": "Rice item added successfully"}, {"result": "success"} ]' };
  } catch (error: any) {
    console.error('Error adding rice item 5:', error.code);
    if (error.code === 'P2002') {
      return { message: '[{"message": "Rice item with this name already exists"}, {"result": "error"} ]' };
    }
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


export async function deleteRiceItemAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await db.rice.delete({
      where: { id },
    });
    revalidatePath("/inventory");
    return { success: true };
  } catch (err: any) {
    console.error("Delete error:", err);
    return { success: false, error: "Failed to delete rice item" };
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
// export async function getDistributions() {
//   return db.employeeDistribution.findMany({
//     include: { employee: true, rice: true, createdBy: true },
//     orderBy: { dateGiven: "desc" },
//   });
// }

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