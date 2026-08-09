import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import db from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST() {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await clerkClient.users.getUser(userId);

  await db.user.upsert({
    where: { clerkId: user.id },
    update: {
      email: user.emailAddresses[0].emailAddress,
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
    },
    create: {
      clerkId: user.id,
      email: user.emailAddresses[0].emailAddress,
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      role: "USER",
    },
  });

  return NextResponse.json({ status: "saved" });
}