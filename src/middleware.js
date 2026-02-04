import { auth } from "@/auth"
import { NextResponse } from "next/server"

const PUBLIC = [
  "/",
  "/api/auth/signin/google",
  "/api/auth/callback/google",
  "/api/auth/signout",
  "/api/auth/session/google",
]

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth?.user
  const isApi = pathname.startsWith("/api")

  const isPublic = PUBLIC.includes(pathname)

  const isServerAction =
    req.method === "POST" &&
    req.headers.get("accept")?.includes("text/x-component")

  if (isServerAction) {
    return NextResponse.next()
  }

  if (isPublic) {
    return NextResponse.next()
  }

  if (!isLoggedIn) {
    if (isApi) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "content-type": "application/json" } }
      )
    }

    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
