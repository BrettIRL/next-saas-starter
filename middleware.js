import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });
    const isAuthenticated = !!token;
    const isAuthPage =
      req.nextUrl.pathname.startsWith('/login') ||
      req.nextUrl.pathname.startsWith('/signup');

    if (isAuthPage) {
      if (isAuthenticated) {
        return NextResponse.redirect(new URL('/', req.url));
      }

      return null;
    }

    if (!isAuthenticated) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url),
      );
    }
  },
  {
    callbacks: {
      async authorized() {
        // NOTE: This forces the middleware function to be called every time.
        // This is required for handling redirects on auth pages.
        return true;
      },
    },
  },
);

export const config = {
  matcher: ['/login', '/signup'],
};
