import { Center, useMantineColorScheme } from '@mantine/core';
import { IconCards } from '@tabler/icons-react';

function HomeIllustration() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return (
    <Center>
      <IconCards color={colorScheme === 'dark' ? '#343A40' : '#F1F3F5'} size={"30rem"} />
    </Center>
  );
}

export default HomeIllustration;