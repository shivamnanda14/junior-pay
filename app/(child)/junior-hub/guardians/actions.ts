"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function linkGuardian(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== "JUNIOR") return { error: "Unauthorized" };

  const code = (formData.get("code") as string).trim();

  // Fetch the code and the current logged-in Junior
  const invite = await prisma.inviteCode.findUnique({ where: { code: code } });
  const currentChild = await prisma.child.findUnique({ where: { id: user.userId } });

  // Baseline Security Checks
  if (!invite) return { error: "Invalid code. Please check the digits and try again." };
  if (invite.isUsed) return { error: "This code has already been used." };
  
  // Check 10-Minute Expiry
  if (invite.expiresAt < new Date()) {
    return { error: "This code has expired. Ask your parent to generate a new 10-minute code." };
  }
  
  // STRICT IDENTITY MATCHING
  const targetUsername = invite.childName.toLowerCase();
  const myUsername = currentChild?.username?.toLowerCase();

  if (targetUsername !== myUsername) {
    return { error: `Security Alert: This code is locked to @${targetUsername}. You are logged in as @${myUsername}.` };
  }

  // Check for Existing Connection
  const existingConnection = await prisma.childConnection.findFirst({
    where: {
      childId: user.userId,
      parentId: invite.parentId
    }
  });

  if (existingConnection) {
    return { error: "You are already connected to this guardian!" };
  }

  // The Atomic Transaction
  await prisma.$transaction([
    prisma.childConnection.create({
      data: {
        childId: user.userId,
        parentId: invite.parentId,
        limitType: "DAILY",
        limitAmount: invite.dailyLimit, 
      },
    }),
    prisma.inviteCode.update({
      where: { id: invite.id },
      data: { isUsed: true },
    })
  ]);

  revalidatePath("/junior-hub/guardians");
  revalidatePath("/junior-hub"); 
  
  // Return success if everything passed
  return { success: true };
}