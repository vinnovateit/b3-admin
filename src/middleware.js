import { auth } from "@/auth";
import { NextResponse } from "next/server";

const PUBLIC = [
  "/",                 // your sign-in page
  "/api/auth/signin",
  "/api/auth/callback",
  "/api/auth/signout",
  "/api/auth/session",
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth?.user;
  const isApi = pathname.startsWith("/api");

  if (PUBLIC.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    if (isApi) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }

    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
