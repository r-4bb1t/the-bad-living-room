import "./globals.css";

import Logo from "@/components/Logo";

import { Header, Layout } from "@r-4bb1t/rabbit-ui";

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
