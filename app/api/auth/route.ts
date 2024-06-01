import { PrismaClient } from "@prisma/client";

interface KakaoAuth {
  access_token: string;
  token_type: "bearer";
  refresh_token: string;
  expires_in: number;
  scope: "profile_image profile_nickname";
  refresh_token_expires_in: number;
}

interface KakaoUser {
  id: number;
  connected_at: string;
  properties: {
    nickname: string;
    profile_image: string;
  };
  kakao_account: {
    profile: {
      nickname: string;
      profile_image_url: string;
    };
  };
}

export const POST = async (req: Request) => {
  const { code } = await req.json();
  console.log("SSSSSSSSSSSSSSSSSSSS");

  const res = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(
      Object.entries({
        grant_type: "authorization_code",
        client_id: process.env.KAKAO_REST_KEY,
        client_secret: process.env.KAKAO_SECRET_KEY,
        redirect_uri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URL,
        code,
      }),
    ).toString(),
  });

  const kakao: KakaoAuth = await res.json();

  console.log(kakao);

  const userRes = await fetch("https://kapi.kakao.com/v2/user/me", {
    headers: {
      Authorization: `Bearer ${kakao.access_token}`,
    },
  });

  const kakaoUser: KakaoUser = await userRes.json();

  const prisma = new PrismaClient();
  const { id, properties } = kakaoUser;
  const { nickname: name, profile_image: photo } = properties;

  const user = await prisma.user.findUnique({
    where: {
      id: `kakao-${id}`,
    },
  });

  if (!user) {
    await prisma.user.create({
      data: {
        id: `kakao-${id}`,
        name,
        photo,
      },
    });
  } else {
    await prisma.user.update({
      where: {
        id: `kakao-${id}`,
      },
      data: {
        name,
        photo,
      },
    });
  }

  await prisma.$disconnect();
  return Response.json({
    user: {
      id: `kakao-${id}`,
      name,
      photo,
    },
  });
};
