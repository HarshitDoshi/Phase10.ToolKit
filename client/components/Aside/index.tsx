import { Aside as MantineAside, MediaQuery } from '@mantine/core';
import { AsideFooter, AsideHeader, AsideMain } from './components';

function Aside() {
  return (
    <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
      <MantineAside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
        <AsideHeader />
        <AsideMain />
        <AsideFooter />
      </MantineAside>
    </MediaQuery>
  );
}

export default Aside;