import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth")
    const isApiAuthRoute = req.nextUrl.pathname.startsWith("/api/auth")
    const isPublicApiRoute = req.nextUrl.pathname.startsWith("/api/public")

    // Allow API auth routes
    if (isApiAuthRoute) {
      return NextResponse.next()
    }

    // Allow public API routes
    if (isPublicApiRoute) {
      return NextResponse.next()
    }

    // Redirect authenticated users away from auth pages
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // Redirect unauthenticated users to sign in
    // if (!isAuthPage && !isAuth) {
    //   let from = req.nextUrl.pathname
    //   if (req.nextUrl.search) {
    //     from += req.nextUrl.search
    //   }

    //   return NextResponse.redirect(new URL(`/auth/signin?from=${encodeURIComponent(from)}`, req.url))
    // }

    // Check user role for admin routes
    if (req.nextUrl.pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        const publicRoutes = ["/", "/documentation", "/installers"]
        if (publicRoutes.includes(req.nextUrl.pathname)) {
          return true
        }

        // Require authentication for protected routes
        if (
          req.nextUrl.pathname.startsWith("/dashboard") ||
          req.nextUrl.pathname.startsWith("/properties") ||
          req.nextUrl.pathname.startsWith("/analysis") ||
          req.nextUrl.pathname.startsWith("/settings")
        ) {
          return !!token
        }

        return true
      },
    },
  },
)

export const config = {
  matcher: ["/((?!api/auth|api/public|_next/static|_next/image|favicon.ico|placeholder.svg).*)"],
}
