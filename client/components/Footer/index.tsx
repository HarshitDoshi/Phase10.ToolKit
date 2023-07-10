import { Text, Flex, Footer as MantineFooter, useMantineColorScheme, Button, Avatar, Badge } from '@mantine/core';
import { Logo } from './_logo';

function Footer() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return (
    <MantineFooter height={60} p="xs">
      <Flex direction={"row"} justify={"space-between"} align={"center"}>
        <Flex direction={"row"} justify={"center"} align={"center"}>
          <Logo colorScheme={colorScheme} />
        </Flex>
        <Flex direction={"row"} justify={"center"} align={"center"}>
          <Button ff={"monospace"} mx={"md"} px={"xs"} component="a" href="https://shunyaek.se" variant={"subtle"}>
            <Badge ff={"monospace"}
              tt={"none"}
              pl={0}
              size="xl"
              color={colorScheme === "dark" ? "green" : "dark"}
              variant={"filled"}
              c={colorScheme === "dark" ? "dark" : "green"}
              radius="xl"
              leftSection={
                <Avatar
                  variant={"filled"}
                  alt="Harshit Doshi"
                  size={30}
                  mr={6}
                  radius={"xl"}
                  color={colorScheme === "dark" ? "dark" : "green"}
                >
                  <Text ff={"monospace"} c={colorScheme === "dark" ? "green" : "dark"}>01</Text>
                </Avatar>
              }>
              shunyaek.se
            </Badge>
          </Button>
        </Flex>
      </Flex>
    </MantineFooter>
  );
}

export default Footer;