import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/session';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const urlParams = request.nextUrl.searchParams;

  // Define our route groups
  const isParentRoute = path.startsWith('/parent-dashboard');
  const isJuniorRoute = path.startsWith('/junior-hub');
  const isAuthRoute = path.startsWith('/login');
  const isPublicRoute = path === '/';
  
  // The bypass flag allows logged-in users to view the landing page if they explicitly click a link to it
  const isViewingHome = urlParams.get('view') === 'home';

  // Look for the secure HTTP-Only cookie
  const cookie = request.cookies.get('junior_session')?.value;
  const session = await decrypt(cookie);

  // SECURITY GATE: Unauthenticated Users
  if ((isParentRoute || isJuniorRoute) && !session) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  // ROUTING GATE: Authenticated Users
  if (session) {
    const { role } = session;

    // Auto-Login Feature & Default Dashboard Routing
    // Redirects to dashboard IF they are on /login OR if they hit the root URL without the bypass flag
    if (isAuthRoute || (isPublicRoute && !isViewingHome)) {
      if (role === 'PARENT') {
        return NextResponse.redirect(new URL('/parent-dashboard', request.nextUrl));
      }
      if (role === 'JUNIOR') {
        return NextResponse.redirect(new URL('/junior-hub', request.nextUrl));
      }
    }

    // Prevent Parents from snooping in the Junior Hub
    if (isJuniorRoute && role !== 'JUNIOR') {
      return NextResponse.redirect(new URL('/parent-dashboard', request.nextUrl));
    }

    // Prevent Juniors from accessing the Parent Dashboard
    if (isParentRoute && role !== 'PARENT') {
      return NextResponse.redirect(new URL('/junior-hub', request.nextUrl));
    }
  }

  // If all checks pass, let them load the page
  return NextResponse.next();
}