import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Naver from "next-auth/providers/naver";
import Kakao from "next-auth/providers/kakao";

// 이 파일은 middleware(Edge Runtime)에서도 사용되므로
// Node.js 전용 모듈(prisma, bcrypt 등)을 import하면 안 됩니다.
// CredentialsProvider는 auth.ts에서 추가합니다.

export default {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Naver({
      clientId: process.env.AUTH_NAVER_ID,
      clientSecret: process.env.AUTH_NAVER_SECRET,
    }),
    Kakao({
      clientId: process.env.AUTH_KAKAO_ID,
      clientSecret: process.env.AUTH_KAKAO_SECRET,
    }),
  ],
} satisfies NextAuthConfig;
