import "@mantine/core/styles.css";
import "@aws-amplify/ui-react/styles/reset.css";
import "@aws-amplify/ui-react/styles.css";
import "./globals.css";
import { cookies } from "next/headers";
import type { ColorMode } from "@aws-amplify/ui-react";
import { ThemeStyle } from "@aws-amplify/ui-react/server";
import { theme } from "@/theme";
// import { theme } from "@/theme/synthTheme";
import { Layout } from "@/components/Layout";
import { Header } from "@/components/Header";
import ThemeToggle from "@/components/ThemeToggle";
import Head from "next/head";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const colorMode = (cookieStore.get("colorMode")?.value ??
    "dark") as ColorMode;
  return (
    <html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin={"anonymous"}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Ubuntu+Sans:ital,wght@0,100..800;1,100..800&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body
        {...theme.containerProps({ colorMode })}
        style={{
          backgroundColor: `${theme.tokens.colors.background.primary}`,
          color: `${theme.tokens.colors.font.primary}`,
        }}
      >
        <Layout>
          <Header>
            <ThemeToggle initialValue={colorMode} />
          </Header>
          {children}
        </Layout>
        <ThemeStyle theme={theme} />
      </body>
    </html>
  );
}
