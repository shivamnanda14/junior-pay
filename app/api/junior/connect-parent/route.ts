import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { parentCode, childId } = await req.json();

    // Look up the parent using their phone number
    const parent = await prisma.parentUser.findUnique({
      where: { phoneNumber: parentCode },
    });

    if (!parent) {
      return NextResponse.json({ error: "Parent not found" }, { status: 404 });
    }

    // Check if any existing connections exist for this child to determine primary status
    const existingRelationCount = await prisma.childConnection.count({
      where: { childId },
    });

    // Create or update the unique parent-child mapping using the Prisma schema types
    await prisma.childConnection.upsert({
      where: {
        childId_parentId: {
          parentId: parent.id,
          childId,
        },
      },
      update: {},
      create: {
        parentId: parent.id,
        childId,
        isPrimary: existingRelationCount === 0, // First parent linked becomes primary
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Link error:", error);
    return NextResponse.json({ error: "Could not link parent" }, { status: 500 });
  }
}