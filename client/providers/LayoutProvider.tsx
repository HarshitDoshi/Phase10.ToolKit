"use client"

import MantineProvider from "@/providers/MantineProvider";
import ColorSchemeProvider from "@/providers/ColorSchemeProvider";
import AppShell from "@/components/AppShell";
import { useEffect, useState } from "react";
import { ColorScheme } from "@mantine/core";

export default function LayoutProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) => setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  useEffect(() => {
    const colorSchemeFromSessionStorage = localStorage.getItem("Phase10.ToolKit.ColorScheme");
    if (colorSchemeFromSessionStorage !== null) {
      setColorScheme(JSON.parse(colorSchemeFromSessionStorage));
    } else {
      setColorScheme("light");
    }
  }, []);
  return (
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
  );
}