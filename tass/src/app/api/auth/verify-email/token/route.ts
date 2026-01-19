import { NextRequest, NextResponse } from "next/server";

/**
 * Production-ready email verification redirect
 * - Redirects from /api/.../token to frontend /auth/verify-email
 * - Works automatically on localhost, staging, or production
 */
export async function GET(request: NextRequest) {
  // Get token from query
  const token = request.nextUrl.searchParams.get("token");

  // Determine base URL dynamically
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const host = request.headers.get("host") || "localhost:3000";
  const baseURL = `${protocol}://${host}`;

  // No token → redirect to frontend with error
  if (!token) {
    return NextResponse.redirect(`${baseURL}/auth/verify-email/?error=no_token`);
  }

  // Redirect to frontend verify page with token
  const redirectURL = `${baseURL}/auth/verify-email/?token=${encodeURIComponent(token)}`;
  return NextResponse.redirect(redirectURL);
}