import { Navbar, Text, rem } from '@mantine/core';

function NavigationBarHeader() {
  return (
    <Navbar.Section mx={"md"} sx={(theme) => ({
      borderBottom: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
        }`,
    })}>
      <Text mb={"md"} size={"lg"} weight={"bold"}>Phases</Text>
    </Navbar.Section>
  );
}

export default NavigationBarHeader;