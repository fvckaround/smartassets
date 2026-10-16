// Edge-safe config (no mongoose / bcrypt imports) used by middleware.
export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const user = auth?.user;
      const path = nextUrl.pathname;

      if (path.startsWith("/admin")) {
        return !!user && user.role === "admin";
      }
      if (path.startsWith("/dashboard")) {
        return !!user;
      }
      if ((path === "/login" || path === "/register") && user) {
        return Response.redirect(
          new URL(user.role === "admin" ? "/admin" : "/dashboard", nextUrl)
        );
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};