"use client"

import { AppShell as MantineAppShell, Text } from '@mantine/core';
import { AppShellPropsType } from './types';
import Header from "../Header";
import NavigationBar from "../NavigationBar";
import Footer from "../Footer";
import Aside from '../Aside';
import { useState } from 'react';

function AppShell({ children }: AppShellPropsType) {
  const [opened, setOpened] = useState<boolean>(false);
  return (
    <MantineAppShell
      padding="md"
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={<NavigationBar opened={opened} setOpened={setOpened} />}
      // aside={<Aside />}
      header={<Header opened={opened} setOpened={setOpened} />}
      // footer={<Footer />}
      styles={(theme) => ({
          main: {
            background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
          },
      })}
    >
      {children}
    </MantineAppShell>
  );
}

export default AppShell;