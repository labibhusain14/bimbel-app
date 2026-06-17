import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-32-chars-minimum!!"
);

export interface SessionUser {
  id: string;
  email: string;
  role: "admin" | "teacher" | "student";
  full_name: string;
}

export async function createSession(user: SessionUser): Promise<string> {
  return await new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySession(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = "bimbel_auth";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 hari
