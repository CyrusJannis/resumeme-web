import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/editor",
  "/settings",
  "/admin",
  "/api/resumes",
  "/api/user",
  "/api/subscription",
];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const pathname = req.nextUrl.pathname;

  // Check if route is protected
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !token) {
    // Redirect unauthenticated users to login
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Check admin routes
  if (pathname.startsWith("/admin")) {
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
    if (!adminEmails.includes(token?.email as string)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next|static|favicon).)*",
    "/api/:path*",
  ],
};
