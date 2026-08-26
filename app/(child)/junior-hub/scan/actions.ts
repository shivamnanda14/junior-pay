"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export async function createPaymentRequest(formData: FormData) {
  const session = await getCurrentUser();
  if (!session || session.role !== "JUNIOR") {
    return { error: "Unauthorized session." };
  }

  const merchantName = (formData.get("merchantName") as string) || "Unknown Merchant";
  const merchantVpa = (formData.get("merchantVpa") as string)?.trim();
  const amount = parseFloat(formData.get("amount") as string);
  const parentId = formData.get("parentId") as string;
  const reason = (formData.get("reason") as string) || "General Expense";
  const customNote = (formData.get("customNote") as string)?.trim() || "";
  const pin = (formData.get("pin") as string)?.trim();

  if (!merchantVpa || isNaN(amount) || !parentId || !pin) {
    return { error: "Missing required transaction details or security PIN." };
  }

  if (reason === "🔄 Other (Specify)" && !customNote) {
    return { error: "Please specify the purpose of payment when selecting Other." };
  }

  // 1. Verify PIN
  const junior = await prisma.child.findUnique({
    where: { id: session.userId },
  });

  if (!junior || junior.pin !== pin) {
    return { error: "Incorrect security PIN. Request denied." };
  }

  // 2. Verify connection & limit
  const connection = await prisma.childConnection.findFirst({
    where: {
      childId: session.userId,
      parentId: parentId,
    },
  });

  if (!connection) {
    return { error: "Selected guardian is not connected to your account." };
  }

  // 🚨 LIMIT EXCEEDED CHECK: Calculate remaining allowance limit
  if (amount > connection.dailyLimit) {
    return { 
      error: `Limit exceeded! Your daily limit for this guardian is ₹${connection.dailyLimit}. You cannot request ₹${amount}.` 
    };
  }

  const fullPurpose = reason === "🔄 Other (Specify)" 
    ? customNote 
    : (customNote ? `${reason}: ${customNote}` : reason);

  // 3. Create Transaction
  await prisma.transaction.create({
    data: {
      amount: amount,
      merchantName: `${merchantName} (${fullPurpose})`,
      merchantVpa: merchantVpa,
      childId: session.userId,
      parentId: parentId,
      status: "PENDING",
    },
  });

  redirect("/junior-hub/history");
}