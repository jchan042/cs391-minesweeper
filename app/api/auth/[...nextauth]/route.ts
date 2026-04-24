import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";


// nextauth handler for v5
const handler = NextAuth({
  providers: [
    GoogleProvider({
      // using only google as the provider
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { // additional params for google oauth
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
});

export { handler as GET, handler as POST };
