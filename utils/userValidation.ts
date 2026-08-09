import { auth } from "@clerk/nextjs/server";
import db from "@/utils/db";
// function to verfiy the user role and return true or false
// type Role = "USER" | "ADMIN" | "SUPERUSER";

// interface User {
//   role: Role;
// }

type ROLE = "USER" | "ADMIN" | "SUPERUSER";

export default async function verifyUser(user: ROLE): Promise<boolean> {
  const { userId } = auth();
  let role: string | null = null;
  if (userId) {
    const currentUser = await db.user.findUnique({
      where: { clerkId: userId },
    });
    role = currentUser?.role ?? null;
  }
  const isSuper = role === user;
  return isSuper;
}