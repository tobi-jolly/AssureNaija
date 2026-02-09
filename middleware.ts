// middleware.ts (root level, next to app/)
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  // If user tries to access dashboard without being signed in → redirect to sign-in with redirect_url
  if (isProtectedRoute(req) && !userId) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // If already signed in and trying to access sign-in or sign-up → redirect to dashboard/chat
  if (userId && (req.nextUrl.pathname.startsWith('/sign-in') || req.nextUrl.pathname.startsWith('/sign-up'))) {
    return NextResponse.redirect(new URL('/dashboard/chat', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Apply middleware to everything except static files, api, and Clerk's own paths
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};