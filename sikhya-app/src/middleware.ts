import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: { signIn: '/signin' },
});

export const config = {
  matcher: ['/dashboard/:path*', '/tutor/:path*', '/learn/:path*', '/practice/:path*', '/progress/:path*', '/settings/:path*'],
};
