import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

// In production, this comes from your .env file
const secretKey = "junior-pay-super-secret-key-change-in-production";
const key = new TextEncoder().encode(secretKey);

// Define what data we store in the cookie
export type SessionPayload = {
  userId: string;
  role: "PARENT" | "JUNIOR";
  expiresAt: Date;
};

// 1. Encrypt the data into a token
export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // Session lasts 7 days
    .sign(key);
}

// 2. Decrypt the token to check if user is logged in
export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch (error) {
    return null;
  }
}

// 3. Create the HTTP-Only cookie
export async function createSession(userId: string, role: "PARENT" | "JUNIOR") {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, role, expiresAt });
  
  const cookieStore = await cookies();
  cookieStore.set("junior_session", session, {
    httpOnly: true, // Prevents JavaScript from reading the cookie (XSS protection)
    secure: process.env.NODE_ENV === "production", // Only over HTTPS in production
    expires: expiresAt,
    sameSite: "lax", // CSRF protection
    path: "/",
  });
}

// 4. Clear the cookie (Logout)
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("junior_session");
}
// 5. Get the current logged-in user securely on the server
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("junior_session")?.value;
  if (!sessionCookie) return null;
  return await decrypt(sessionCookie);
}