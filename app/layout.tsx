"use client";

import { Header, Layout } from "@r-4bb1t/rabbit-ui";
import "./globals.css";
import Logo from "@/components/Logo";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Layout mobileFirst>
          <Header title={<Logo />} mobileFirst className="!px-4" />
          {children}
        </Layout>
      </body>
    </html>
  );
}
