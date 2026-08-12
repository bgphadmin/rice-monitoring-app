"use server";

import db from "@/utils/db";
import { riceSchema } from "./validation/riceSchema";
import { distributionSchema } from "./validation/distributionSchema";
import { revalidatePath } from "next/cache";
import { userSchema } from "./validation/userSchema";
import { auth } from "@clerk/nextjs/server";
import verifyUser from "./userValidation";
import { ZodError } from "zod";

/* ------------------ Rice Actions ------------------ */
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
      
      
      
      
    //   if (err instanceof ZodError) {
    //   return {
    //     message: 
    //       JSON.stringify([
    //         { message: "Error deleting rice item: " + JSON.parse(err.message)[0].message || err.message },
    //         { result: "error" }
    //       ])
    //   };
    // } else if (err instanceof Error) {
    //   return {
    //     message: JSON.stringify([
    //       { message: "Error deleting rice item: " + err.message },
    //       { result: "error" },
    //     ])
    //   };
    // } else {
    //   return {
    //     message: JSON.stringify([
    //       { message: "Unknown error occurred" },
    //       { result: "error" },
    //     ])
    //   };
    // }
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
  } catch (error: unknown) {
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