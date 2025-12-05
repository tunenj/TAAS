// app/api/auth/verify-email/token/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');
  
  if (!token) {
    console.error('No token provided');
    return NextResponse.redirect(new URL('/auth/verify-email?error=no_token', request.url));
  }
  
  try {
    // Decode the token
    const decodedToken = decodeURIComponent(token);
    console.log('Decoded token:', decodedToken);
    
    const email = decodedToken.split(':')[0];
    console.log(`Email to verify: ${email}`);
    
    // Redirect to frontend page with token
    const redirectUrl = `/auth/verify-email?token=${encodeURIComponent(token)}`;
    console.log('Redirecting to:', redirectUrl);
    
    return NextResponse.redirect(new URL(redirectUrl, request.url));
    
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.redirect(new URL('/auth/verify-email?error=server_error', request.url));
  }
}