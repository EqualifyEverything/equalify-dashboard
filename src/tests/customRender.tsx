import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  cleanup,
  RenderOptions,
  render as rtlRender,
} from '@testing-library/react';
import {
  createMemoryRouter,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';
import { afterEach } from 'vitest';

interface CustomRenderOptions extends Omit<RenderOptions, 'queries'> {
  routeOptions?: {
    routes: RouteObject[];
    initialEntries?: string[];
  };
  queryClientConfig?: ConstructorParameters<typeof QueryClient>[0];
}

const render = (ui: React.ReactElement, options: CustomRenderOptions = {}) => {
  const { routeOptions, queryClientConfig, ...renderOptions } = options;

  afterEach(() => cleanup());

  const queryClient = new QueryClient(queryClientConfig || {});

  const defaultRoutes = [{ path: '/', element: ui }];

  const router = createMemoryRouter(
    routeOptions ? routeOptions.routes : defaultRoutes,
    {
      initialEntries: routeOptions?.initialEntries || ['/'],
    },
  );

  const Wrapper = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );
  };
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};
export * from '@testing-library/react';
export { render };