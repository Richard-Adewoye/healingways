import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Passthrough response; client-side Firebase Auth manages session state
  return NextResponse.next({
    request,
  });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
