import { Outlet } from 'react-router-dom';

import { RootLayout } from '~/components/layout';
import { Protected } from '.';

const Root = () => (
  <Protected>
    <RootLayout>
      <Outlet />
    </RootLayout>
  </Protected>
);

export default Root;
