"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function linkGuardian(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== "JUNIOR") throw new Error("Unauthorized");

  const code = formData.get("code") as string;

  // Fetch the code and the current logged-in Junior
  const invite = await prisma.inviteCode.findUnique({ where: { code: code } });
  const currentChild = await prisma.child.findUnique({ where: { id: user.userId } });

  // Baseline Security Checks
  if (!invite) throw new Error("Invalid code.");
  if (invite.isUsed) throw new Error("This code has already been used.");
  if (invite.expiresAt < new Date()) throw new Error("This code has expired.");
  
  // NEW SECURITY CHECK: Strict Identity Matching!
  if (invite.childName !== currentChild?.username) {
    throw new Error("Security Alert: This code was generated for a different username.");
  }

  // The Atomic Transaction
  await prisma.$transaction([
    prisma.childConnection.create({
      data: {
        childId: user.userId,
        parentId: invite.parentId,
        limitAmount: invite.dailyLimit, // Change dailyLimit to limitAmount here
      },
    }),
    prisma.inviteCode.update({
      where: { id: invite.id },
      data: { isUsed: true },
    })
  ]);

  revalidatePath("/junior-hub/guardians");
  // Also revalidate the main hub so the count updates instantly!
  revalidatePath("/junior-hub"); 
}