"use client"

import './globals.css';
import { Inter } from 'next/font/google';
import MantineProvider from "@/providers/MantineProvider";
import ColorSchemeProvider from "@/providers/ColorSchemeProvider";
import AppShell from "@/components/AppShell";
import { useEffect, useState } from 'react';
import { ColorScheme } from '@mantine/core';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] })

// export const metadata = {
//   title: 'Phase10.ToolKit',
//   description: 'A toolkit designed for Phase 10 players.',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  useEffect(() => {
    const colorSchemeFromSessionStorage = localStorage.getItem("Phase10.ToolKit.ColorScheme");
    if (colorSchemeFromSessionStorage !== null) {
      setColorScheme(JSON.parse(colorSchemeFromSessionStorage));
    } else {
      setColorScheme("light");
    }
  }, [])
  return (
    <html lang="en">
      <body className={inter.className}>
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{ colorScheme, loader: 'dots' }}
          >
            <AppShell
            >
              {children}
            </AppShell>
          </MantineProvider>
        </ColorSchemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
