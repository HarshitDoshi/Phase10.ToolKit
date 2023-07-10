import { Text, Flex, Footer as MantineFooter, useMantineColorScheme, Anchor } from '@mantine/core';
import { Logo } from './_logo';

function Footer() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const year = new Date().getFullYear();
  return (
    <MantineFooter height={60} p="xs">
      <Flex direction={"row"} justify={"space-between"} align={"center"}>
        <Flex direction={"row"} justify={"center"} align={"center"}>
          <Anchor href="https://shunyaek.se" target="_blank">
            <Logo colorScheme={colorScheme} />
          </Anchor>
        </Flex>
        <Flex direction={"row"} justify={"center"} align={"center"}>
          <Text ff={"monospace"}>
            &copy;{" "}
            {`shunyaek.se ${year}`}
          </Text>
        </Flex>
      </Flex>
    </MantineFooter>
  );
}

export default Footer;