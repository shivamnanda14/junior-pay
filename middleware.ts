import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/session';

// 1. Specify which routes the middleware should protect
// This regex tells it to run on every page EXCEPT background Next.js files and images
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define our route groups
  const isParentRoute = path.startsWith('/parent-dashboard');
  const isJuniorRoute = path.startsWith('/junior-hub');
  const isAuthRoute = path.startsWith('/login');
  const isPublicRoute = path === '/';

  // 2. Look for the secure HTTP-Only cookie
  const cookie = request.cookies.get('junior_session')?.value;
  const session = await decrypt(cookie);

  // 3. SECURITY GATE: Unauthenticated Users
  if ((isParentRoute || isJuniorRoute) && !session) {
    // If they have no cookie and try to access a dashboard, kick them to login
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  // 4. ROUTING GATE: Authenticated Users
  if (session) {
    const { role } = session;

    // A. The "Remember Me" Auto-Login Feature
    if (isAuthRoute || isPublicRoute) {
      if (role === 'PARENT') {
        return NextResponse.redirect(new URL('/parent-dashboard', request.nextUrl));
      }
      if (role === 'JUNIOR') {
        return NextResponse.redirect(new URL('/junior-hub', request.nextUrl));
      }
    }

    // B. Prevent Parents from snooping in the Junior Hub
    if (isJuniorRoute && role !== 'JUNIOR') {
      return NextResponse.redirect(new URL('/parent-dashboard', request.nextUrl));
    }

    // C. Prevent Juniors from accessing the Parent Dashboard
    if (isParentRoute && role !== 'PARENT') {
      return NextResponse.redirect(new URL('/junior-hub', request.nextUrl));
    }
  }

  // 5. If all checks pass, let them load the page
  return NextResponse.next();
}