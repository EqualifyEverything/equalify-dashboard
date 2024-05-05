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
import {
  Account,
  CreateReport,
  EditReport,
  Login,
  MessageDetails,
  PageDetails,
  ReportDetails,
  Reports,
  Root,
  Signup,
  TagDetails,
} from '~/routes';

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
        path: 'reports',
        element: <Reports />,
      },
      {
        path: 'reports/create-report',
        element: <CreateReport />,
      },
      {
        path: 'reports/:reportId',
        element: <ReportDetails />,
        errorElement: <NotFound />,
      },
      {
        path: 'reports/:reportId/edit',
        element: <EditReport />,
      },
      {
        path: 'reports/:reportId/messages/:messageId',
        element: <MessageDetails />,
      },
      {
        path: 'reports/:reportId/tags/:tagId',
        element: <TagDetails />,
      },
      {
        path: 'reports/:reportId/pages/:pageId',
        element: <PageDetails />,
      },
      {
        path: 'account',
        element: <Account />,
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
