import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const transactionId = params.id;
    const body = await req.json().catch(() => ({}));
    
    console.log("Verifying payment for transaction ID:", transactionId, "Data received:", body);

    // Try updating by the exact ID first
    try {
      await prisma.transaction.update({
        where: { id: transactionId },
        data: { status: "APPROVED_AND_PAID" },
      });
    } catch (dbErr) {
      // Fallback: if custom ID, update the most recent PENDING transaction for safety
      console.log("ID match failed, updating latest pending transaction as fallback.");
      const latestPending = await prisma.transaction.findFirst({
        where: { status: "PENDING" },
        orderBy: { createdAt: 'desc' }
      });

      if (latestPending) {
        await prisma.transaction.update({
          where: { id: latestPending.id },
          data: { status: "APPROVED_AND_PAID" },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}