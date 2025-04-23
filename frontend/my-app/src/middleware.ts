import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isValidRoute } from "./app/routes";

// Auth routes that should always be accessible
const AUTH_ROUTES = ["/auth/login", "/auth/register"];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Redirect root to dashboard
  if (path === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Always allow auth routes
  if (AUTH_ROUTES.includes(path)) {
    return NextResponse.next();
  }

  // Check if the route is valid
  if (!isValidRoute(path)) {
    // Handle invalid routes - redirect to 404 or dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Add authentication check here if needed
  // const isAuthenticated = checkAuth(request);
  // if (!isAuthenticated) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
