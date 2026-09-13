"use server";

import prisma from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

// --- PARENT AUTHENTICATION ---
export async function authenticateParent(formData: FormData) {
  const phone = formData.get("phone") as string;
  const name = formData.get("name") as string;
  // ADDED .trim() TO FIX WHITESPACE ISSUES
  const pin = (formData.get("pin") as string).trim(); 

  try {
    let parent = await prisma.parentUser.findUnique({
      where: { phoneNumber: phone },
    });

    // RETURN ERROR OBJECT INSTEAD OF THROWING
    if (parent && parent.pin !== pin) {
      return { error: "Invalid PIN. Please try again." }; 
    }

    if (!parent) {
      parent = await prisma.parentUser.create({
        data: {
          phoneNumber: phone,
          name: name || "New Parent",
          pin: pin,
        },
      });
    }

    await createSession(parent.id, "PARENT");
  } catch (error: any) {
    console.error("Parent login database error:", error);
    return { error: "Failed to connect to database." };
  }

  // Redirect runs if no errors were returned
  redirect("/parent-dashboard");
}

// --- JUNIOR AUTHENTICATION ---
export async function authenticateJunior(formData: FormData) {
  const username = (formData.get("username") as string).toLowerCase().trim();
  const pin = formData.get("pin") as string;
  const name = formData.get("name") as string;

  try {
    let child = await prisma.child.findUnique({
      where: { username: username },
    });

    if (child && child.pin !== pin) {
      throw new Error("Invalid PIN. Please try again.");
    }

    if (!child) {
      child = await prisma.child.create({
        data: {
          username: username,
          pin: pin,
          name: name || username,
        },
      });
    }

    await createSession(child.id, "JUNIOR");
  } catch (error: any) {
    console.error("Junior login database error:", error);
    throw new Error(error.message || "Failed to connect to database.");
  }

  redirect("/junior-hub");
}

// --- LOGOUT ACTION ---
export async function logout() {
  await deleteSession();
  redirect("/login");
}