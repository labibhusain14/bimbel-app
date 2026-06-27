import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/utils/auth/session";

// Route yang butuh login
const protectedRoutes = ["/dashboard"];
// Route yang hanya bisa diakses jika BELUM login
const authRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const user = token ? await verifySession(token) : null;

  // Redirect ke login jika akses protected route tanpa session
  if (protectedRoutes.some((r) => pathname.startsWith(r)) && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect ke dashboard jika akses login/signup saat sudah login
  if (authRoutes.includes(pathname) && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
