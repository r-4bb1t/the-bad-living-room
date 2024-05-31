import type { Account, AuthOptions, Profile, User } from "next-auth";
import KakaoProvider, { KakaoProfile } from "next-auth/providers/kakao";

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
    async signIn(params: {
      user: User;
      account: Account | null;
      profile?: Profile | undefined;
    }) {
      console.log(params.user, params.account, params.profile);
      if (!params.profile) return false;
      try {
        await fetch(`${process.env.NEXTAUTH_URL}/api/login`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            id: "kakao-" + params.user.id,
            name:
              (params.profile as KakaoProfile).nickname ||
              (params.profile as KakaoProfile).kakao_account?.profile
                ?.nickname ||
              (params.profile as KakaoProfile).kakao_account?.name,
            photo:
              (params.profile as KakaoProfile).properties?.profile_image ||
              (params.profile as KakaoProfile).kakao_account?.profile
                ?.profile_image_url,
          }),
        });
        return true;
      } catch (e) {
        return false;
      }
    },
    async session({ session, token, user }) {
      //@ts-ignore
      if (user) session.accessToken = token.accessToken;
      return session;
    },
  },
} satisfies AuthOptions;
