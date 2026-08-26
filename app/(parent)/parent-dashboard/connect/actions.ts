"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function generateInviteCode(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== "PARENT") throw new Error("Unauthorized");

  // We now ask for the specific username instead of just a display name
  const targetUsername = (formData.get("childUsername") as string).toLowerCase();
  const dailyLimit = parseFloat(formData.get("dailyLimit") as string);

  // SECURITY CHECK 1: Does this Junior actually exist?
  const childExists = await prisma.child.findUnique({
    where: { username: targetUsername }
  });

  if (!childExists) {
    throw new Error("Could not find a Junior with that username.");
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.inviteCode.create({
    data: {
      code,
      parentId: user.userId,
      childName: targetUsername, // Storing the exact username to lock the code
      dailyLimit,
      expiresAt,
    },
  });

  revalidatePath("/parent-dashboard/connect");
}