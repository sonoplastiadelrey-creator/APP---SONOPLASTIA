import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect login/cadastro pages to dashboard
  if (pathname.startsWith('/login') || pathname.startsWith('/cadastro')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/login/:path*', '/cadastro', '/cadastro/:path*'],
};
