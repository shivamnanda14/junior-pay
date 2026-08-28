"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export async function createPaymentRequest(formData: FormData) {
  const session = await getCurrentUser();
  if (!session || session.role !== "JUNIOR") {
    return { error: "Unauthorized" };
  }

  const merchantName = formData.get("merchantName") as string;
  const merchantVpa = formData.get("merchantVpa") as string;
  const amountText = formData.get("amount") as string;
  const reason = formData.get("reason") as string;
  const customNote = formData.get("customNote") as string;
  const parentId = formData.get("parentId") as string;
  const pin = formData.get("pin") as string;

  const amount = parseFloat(amountText);

  if (!merchantName || !merchantVpa || !amount || !parentId || !pin) {
    return { error: "All fields are required." };
  }

  if (amount <= 0) {
    return { error: "Amount must be greater than zero." };
  }

  // 1. Verify Junior's PIN
  const child = await prisma.child.findUnique({
    where: { id: session.userId },
  });

  if (child?.pin !== pin) {
    return { error: "Incorrect security PIN." };
  }

  // 2. Fetch the Guardian Connection and their specific limit
  const connection = await prisma.childConnection.findUnique({
    where: {
      childId_parentId: {
        childId: session.userId,
        parentId: parentId,
      },
    },
  });

  if (!connection) {
    return { error: "Guardian connection not found." };
  }

  // 3. CUMULATIVE DAILY / MONTHLY LIMIT LOGIC
  const now = new Date();
  let startDate = new Date();

  if (connection.limitType === "DAILY") {
    startDate.setHours(0, 0, 0, 0); // Resets every day at 12:00 AM
  } else {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0); // Resets 1st of every month
  }

  const periodTransactions = await prisma.transaction.findMany({
    where: {
      childId: session.userId,
      parentId: parentId,
      createdAt: { gte: startDate },
      status: { in: ["PENDING", "APPROVED_AND_PAID"] },
    },
  });

  const spentInPeriod = periodTransactions.reduce((total, tx) => total + tx.amount, 0);
  const remainingLimit = Math.max(0, connection.limitAmount - spentInPeriod);

  if (amount > remainingLimit) {
    return { 
      error: `${connection.limitType === "DAILY" ? "Daily" : "Monthly"} limit exceeded! You only have ₹${remainingLimit.toFixed(2)} remaining for this guardian.` 
    };
  }

  // 4. Create the Transaction
  const finalNote = reason === "🔄 Other (Specify)" ? customNote : reason;

  await prisma.transaction.create({
    data: {
      childId: session.userId,
      parentId: parentId,
      merchantName: merchantName,
      merchantVpa: merchantVpa,
      amount: amount,
      childNote: finalNote,
      status: "PENDING",
    },
  });

  redirect("/junior-hub/history");
}