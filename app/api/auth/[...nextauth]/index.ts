import type { AuthOptions } from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";

export const authOptions = {
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID ?? "",
      clientSecret: process.env.KAKAO_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      //@ts-ignore
      session.accessToken = token.accessToken;
      console.log(user);
      return session;
    },
  },
} satisfies AuthOptions;
