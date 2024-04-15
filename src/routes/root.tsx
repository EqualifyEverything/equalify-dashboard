import { Outlet } from 'react-router-dom';

import RootLayout from '~/components/layout';

const Root = () => (
  <RootLayout>
    <Outlet />
  </RootLayout>
);

export default Root;
