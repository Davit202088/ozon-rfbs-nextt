import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export function middleware(req: NextRequest) {
  const protectedPaths = ['/map', '/api/assignments', '/api/orders/my']
  const isProtected = protectedPaths.some(p => req.nextUrl.pathname.startsWith(p))
  if (!isProtected) return NextResponse.next()
  const token = req.cookies.get('auth_token')?.value
  if (!token) return NextResponse.redirect(new URL('/login', req.url))
  try { jwt.verify(token, process.env.JWT_SECRET!); return NextResponse.next() }
  catch { return NextResponse.redirect(new URL('/login', req.url)) }
}
export const config = { matcher: ['/map/:path*', '/api/assignments/:path*', '/api/orders/my'] }
