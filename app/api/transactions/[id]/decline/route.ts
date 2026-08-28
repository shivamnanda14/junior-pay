import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: transactionId } = await params;

    await prisma.transaction.update({
      where: { id: transactionId },
      data: { status: "DECLINED_BY_PARENT" },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to decline" }, { status: 500 });
  }
}