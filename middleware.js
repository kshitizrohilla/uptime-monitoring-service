import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const url = request.nextUrl.clone();

  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);

      if (url.pathname === '/login' || url.pathname === '/signup') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
    }
  } else {
    if (url.pathname === '/dashboard' ||
      url.pathname.startsWith('/monitors') ||
      url.pathname === '/incidents') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/signup', '/dashboard', '/monitors/:path*', '/incidents']
};