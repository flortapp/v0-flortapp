import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  try {
    // Skip middleware for static assets and API routes
    if (
      req.nextUrl.pathname.startsWith("/_next") ||
      req.nextUrl.pathname.startsWith("/api") ||
      req.nextUrl.pathname.startsWith("/static") ||
      req.nextUrl.pathname.includes(".") // Skip files with extensions
    ) {
      return res
    }

    // Check if Supabase URL is available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("Supabase credentials missing in middleware")

      // If on login page, allow access
      if (req.nextUrl.pathname === "/login") {
        return res
      }

      // Otherwise redirect to login
      return NextResponse.redirect(new URL("/login", req.url))
    }

    const supabase = createMiddlewareClient({ req, res })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If no session and not on login page, redirect to login
    if (!session && req.nextUrl.pathname !== "/login" && req.nextUrl.pathname !== "/debug") {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // If session exists and on login page, redirect to home
    if (session && req.nextUrl.pathname === "/login") {
      return NextResponse.redirect(new URL("/", req.url))
    }

    return res
  } catch (error) {
    console.error("Middleware error:", error)

    // If there's an error and not on login page, redirect to login
    if (req.nextUrl.pathname !== "/login" && req.nextUrl.pathname !== "/debug") {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // Otherwise allow the request to continue
    return res
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
