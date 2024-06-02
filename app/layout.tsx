import "./globals.css";
import { Metadata } from "next";

import Logo from "@/components/logo";

import { Header, Layout } from "@r-4bb1t/rabbit-ui";

export const metadata: Metadata = {
  title: "의상한거실",
  description: "다 같이 의 상해 봅시다.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Layout mobileFirst>
          <Header logo={<Logo />} mobileFirst className="!px-4" />
          {children}
        </Layout>
      </body>
    </html>
  );
}
