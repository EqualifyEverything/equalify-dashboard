import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';

import '~/globals.css';
import '~/amplify.config';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { NotFound } from '~/components/layout';
import { Account, Login, ReportDetails, Reports, Root, Signup } from '~/routes';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Navigate to="/reports" replace />,
      },
      {
        path: 'account',
        element: <Account />,
      },
      {
        path: 'reports',
        element: <Reports />,
      },
      {
        path: 'reports/create-report',
        element: <div>Create Report</div>,
      },
      {
        path: 'reports/:reportId',
        element: <ReportDetails />,
      },
      {
        path: 'reports/:reportId/messages/:messageId',
        element: <div>Message Detail</div>,
      },
      {
        path: 'reports/:reportId/tags/:tagId',
        element: <div>Tag Detail</div>,
      },
      {
        path: 'reports/:reportId/pages/:pageId',
        element: <div>Page Detail</div>,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <NotFound />,
  },
  {
    path: '/signup',
    element: <Signup />,
    errorElement: <NotFound />,
  },
]);

const domNode = document.getElementById('root')!;
const root = createRoot(domNode);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
