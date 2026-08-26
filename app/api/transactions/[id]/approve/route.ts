import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const transactionId = params.id;
    let targetAmount = 100; // Backup default

    // 1. Try to find the transaction in Prisma
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
      });

      if (transaction) {
        targetAmount = transaction.amount;
      }
    } catch (err) {
      console.log("Custom ID format, checking body fallback...");
    }

    // 2. If not found in DB, try reading amount from frontend request body if passed
    try {
      const body = await req.json().catch(() => ({}));
      if (body?.amount) {
        targetAmount = Number(body.amount);
      }
    } catch (e) {
      // Ignore body parse errors if empty
    }

    console.log(`Creating Razorpay order for amount: ₹${targetAmount}`);

    // 3. Create Razorpay Order securely
    const order = await razorpay.orders.create({
      amount: Math.round(targetAmount * 100), // Convert to paise
      currency: "INR",
      receipt: `receipt_${transactionId}`,
    });

    return NextResponse.json({ orderId: order.id, amount: order.amount });
    
  } catch (error: any) {
    console.error("Razorpay API Detailed Error:", error);
    return NextResponse.json({ error: error?.description || "Failed to create order" }, { status: 500 });
  }
}