"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function generateInviteCode(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== "PARENT") throw new Error("Unauthorized");

  // PERFECT SANITIZATION: Removes any "@" symbol at the start, trims spaces, and forces lowercase
  const rawUsername = formData.get("childUsername") as string;
  const targetUsername = rawUsername.replace(/^@/, '').trim().toLowerCase();
  
  const dailyLimit = parseFloat(formData.get("dailyLimit") as string);

  // SECURITY CHECK 1: Does this Junior actually exist?
  const childExists = await prisma.child.findUnique({
    where: { username: targetUsername }
  });

  if (!childExists) {
    throw new Error(`Could not find a Junior with the username: @${targetUsername}`);
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Expiration set strictly to 10 minutes
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.inviteCode.create({
    data: {
      code,
      parentId: user.userId,
      childName: targetUsername, // Storing the EXACT cleaned username to lock the code
      dailyLimit,
      expiresAt,
    },
  });

  revalidatePath("/parent-dashboard/connect");
}