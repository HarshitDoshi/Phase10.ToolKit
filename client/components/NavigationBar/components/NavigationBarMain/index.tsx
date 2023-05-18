import { Avatar, Container, Group, Navbar, ScrollArea, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import { IconDatabase, IconChartHistogram, IconMessages, IconRadar } from '@tabler/icons-react';

function NavigationBarMain() {
  const navigationBarLinks = [
    { icon: <IconRadar size="2rem" />, color: 'blue', label: 'Scanners', description: "VirusTotal-backed Scan Engines" },
    { icon: <IconChartHistogram size="2rem" />, color: 'teal', label: 'Analytics ToolKit', description: "Visualize & Derive Information" },
    { icon: <IconMessages size="2rem" />, color: 'violet', label: 'Foo', description: "foo bar baz" },
    { icon: <IconDatabase size="2rem" />, color: 'grape', label: 'Bar', description: "baz bar foo" },
  ];
  const phases = [
    { index: 1, content: "2 sets of 3", color: "red", },
    { index: 2, content: "1 set of 3 + 1 run of 4", color: "pink", },
    { index: 3, content: "1 set of 4 + 1 run of 4", color: "grape", },
    { index: 4, content: "1 run of 7", color: "violet", },
    { index: 5, content: "1 run of 8", color: "indigo", },
    { index: 6, content: "1 run of 9", color: "blue", },
    { index: 7, content: "2 sets of 4", color: "cyan", },
    { index: 8, content: "7 cards of one color", color: "teal", },
    { index: 9, content: "1 set of 5 + 1 set of 2", color: "green", },
    { index: 10, content: "1 set of 5 + 1 set of 3", color: "lime", },
  ];
  return (
    <Navbar.Section grow component={ScrollArea}>
      {
        phases.map((navigationBarLink) => {
          return (
            <Container
              sx={(theme) => ({
                display: 'block',
                width: '100%',
                padding: theme.spacing.xs,
                borderRadius: theme.radius.sm,
                color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
              })}
              key={navigationBarLink.index}>
              <Group>
                <Avatar color={navigationBarLink.color} radius="xl">{navigationBarLink.index}</Avatar>
                <div>
                  <Text>{`Phase ${navigationBarLink.index}`}</Text>
                  <Text size="xs" color='dimmed'>{navigationBarLink.content}</Text>
                </div>
              </Group>
            </Container>
          );
        })
      }
    </Navbar.Section>
  );
}

export default NavigationBarMain;