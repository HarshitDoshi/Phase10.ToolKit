import { Navbar } from '@mantine/core';
import { NavigationBarPropsType } from './types';
import { NavigationBarFooter, NavigationBarHeader, NavigationBarMain } from './components';

function NavigationBar(props: NavigationBarPropsType) {
  const { opened, setOpened } = props;
  return (
    <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
      <NavigationBarHeader />
      <NavigationBarMain />
      {/* <NavigationBarFooter /> */}
    </Navbar>
  );
}

export default NavigationBar;