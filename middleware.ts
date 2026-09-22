import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const tokenVal = request.cookies.get('accessToken')?.value
  const accessToken = tokenVal && tokenVal.trim() !== '' ? tokenVal : null

  // Helper to extract role safely from JWT token locally
  const getRoleFromToken = (token: string) => {
    try {
      const payloadBase64 = token.split('.')[1]
      if (!payloadBase64) return null
      // decode base64, handling URL-safe formatting
      const decodedPayload = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'))
      const payload = JSON.parse(decodedPayload)
      return payload.role as string
    } catch {
      return null
    }
  }

  const role = accessToken ? getRoleFromToken(accessToken) : null

  // 1. If user is logged in and visits public landing/auth pages, redirect to their dashboard
  if ((pathname === '/login' || pathname === '/') && accessToken && role) {
    if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url))
    } else {
      return NextResponse.redirect(new URL('/user', request.url))
    }
  }

  // 2. Protect Admin pathways
  if (pathname.startsWith('/admin')) {
    if (!accessToken) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/user', request.url))
    }
  }

  // 3. Protect User pathways
  if (pathname.startsWith('/user')) {
    if (!accessToken) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  // Apply middleware to these specific paths
  matcher: ['/', '/login', '/admin/:path*', '/user/:path*'],
}
