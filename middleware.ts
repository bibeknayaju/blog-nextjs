import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      const isLoggedIn = !!token;
      const isOnWritePage = req.nextUrl.pathname.startsWith("/write");
      if (isOnWritePage) {
        if (isLoggedIn) return true;
        return false;
      }
      return true;
    },
  },
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.png).*)"],
};
