export default function middleware(request) {
  const url = new URL(request.url);

  // Allow access to login page, API routes, and static assets
  if (
    url.pathname === '/login.html' ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_next/')
  ) {
    return;
  }

  // Check session cookie for protected pages
  const cookie = request.headers.get('cookie') || '';
  const hasSession = cookie.includes('session=');

  if (!hasSession && url.pathname === '/') {
    return Response.redirect(new URL('/login.html', request.url), 303);
  }
}

export const config = {
  matcher: ['/', '/index.html'],
};
