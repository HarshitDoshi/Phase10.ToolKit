import { useMantineTheme, Header as MantineHeader, MediaQuery, Text, Burger, Box, Group, ActionIcon, useMantineColorScheme, rem, Title } from '@mantine/core';
import { HeaderPropsType } from './types';
import { IconSun, IconMoonStars } from '@tabler/icons-react';
import { Logo } from './_logo';

function Header(props: HeaderPropsType) {
  const theme = useMantineTheme();
  const { opened, setOpened } = props;
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return (
    <MantineHeader height={{ base: 50, md: 70 }} p="md">
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>
        <Box
          sx={(theme) => ({
            width: '100%',
          })}
        >
          <Group position="apart">
            <Logo colorScheme={colorScheme} />
            <ActionIcon variant="default" onClick={() => toggleColorScheme()} size={30}>
              {colorScheme === 'dark' ? <IconSun size="1rem" /> : <IconMoonStars size="1rem" />}
            </ActionIcon>
          </Group>
        </Box>
      </div>
    </MantineHeader>
  );
}

export default Header;