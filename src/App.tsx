import { Amplify } from 'aws-amplify';
import * as Auth from 'aws-amplify/auth'
import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom';
import { Home } from '#src/routes';
import { Navigation } from '#src/components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_USERPOOLID,
      userPoolClientId: import.meta.env.VITE_USERPOOLWEBCLIENTID,
    },
  },
  API: {
    GraphQL: {
      endpoint: `${import.meta.env.VITE_GRAPHQL_URL}/v1/graphql`,
      defaultAuthMode: 'none',
    },
    REST: {
      public: {
        endpoint: `${import.meta.env.VITE_API_URL}/public`,
      },
      auth: {
        endpoint: `${import.meta.env.VITE_API_URL}/auth`,
      },
    },
  },
}, {
  API: {
    GraphQL: {
      headers: async () => ({ Authorization: `Bearer ${(await Auth.fetchAuthSession()).tokens?.idToken?.toString()}` }),
    },
    REST: {
      headers: async ({ apiName }) => apiName === 'auth' ? { Authorization: `Bearer ${(await Auth.fetchAuthSession()).tokens?.idToken?.toString()}` } : { 'X-Api-Key': '1' }
    }
  }
});

const router = createBrowserRouter([
  {
    path: '',
    element: <Navigation />,
    children: [
      { path: '', element: <Home /> },
      { path: '*', element: <Home /> },
    ],
    errorElement: <>
      <Navigation />
      <Link to='/dashboard' className='absolute top-[calc(50%_-_100px)] left-[calc(50%_-_200px)] text-text text-center w-[400px] hover:opacity-50'>
        404 - Page not found!
      </Link>
    </>
  },
]);

export const App = () => <QueryClientProvider client={queryClient}>
  <RouterProvider router={router} />
</QueryClientProvider>