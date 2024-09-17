import '@aws-amplify/ui-react/styles/reset.css'
import '@aws-amplify/ui-react/styles.css'
import { cookies } from 'next/headers';
import type { ColorMode } from '@aws-amplify/ui-react';
import { ThemeStyle } from '@aws-amplify/ui-react/server';
import { theme } from '@/theme';
import { Layout } from '@/components/Layout';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const colorMode = (cookieStore.get('colorMode')?.value ??
    'dark') as ColorMode;
  return (
    <html lang="en">
      <body {...theme.containerProps({colorMode})} style={{
        backgroundColor: `${theme.tokens.colors.background.primary}`,
        color: `${theme.tokens.colors.font.primary}`
      }}>
        <Layout>
          {children}
        </Layout>
        <ThemeStyle theme={theme} />
      </body>
    </html>
  );
}
