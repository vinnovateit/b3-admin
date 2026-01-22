import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth?.user
  const isApi = req.nextUrl.pathname.startsWith("/api")

  if (!isLoggedIn) {
    if (isApi) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { "content-type": "application/json" },
        }
      )
    }

    return Response.redirect(new URL("/login", req.nextUrl.origin))
  }
})

export const config = {
  matcher: ["/:path*"], // Protect everything
}
