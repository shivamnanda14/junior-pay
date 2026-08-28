"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateDailyLimit(formData: FormData) {
  const session = await getCurrentUser();
  if (!session || session.role !== "PARENT") throw new Error("Unauthorized");

  const connectionId = formData.get("connectionId") as string;
  const limitType = formData.get("limitType") as "DAILY" | "MONTHLY";
  const limitAmount = parseFloat(formData.get("dailyLimit") as string);

  await prisma.childConnection.update({
    where: { id: connectionId },
    data: { 
      limitType: limitType || "DAILY",
      limitAmount: limitAmount 
    },
  });

  revalidatePath(`/parent-dashboard/child/${connectionId}`);
}

export async function disconnectChild(formData: FormData) {
  const session = await getCurrentUser();
  if (!session || session.role !== "PARENT") throw new Error("Unauthorized");

  const connectionId = formData.get("connectionId") as string;

  await prisma.childConnection.delete({
    where: { id: connectionId },
  });

  redirect("/parent-dashboard");
}