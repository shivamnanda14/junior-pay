import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.transaction.update({
      where: { id: params.id },
      data: { status: "DECLINED" },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to decline" }, { status: 500 });
  }
}