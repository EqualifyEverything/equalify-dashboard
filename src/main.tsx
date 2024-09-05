import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PostHogProvider } from 'posthog-js/react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';

import '~/globals.css';
import '~/amplify.config';

import { initAnalytics } from '~/analytics';
import { NotFound } from '~/components/layout';
import {
  AccessibilityStatement,
  Account,
  AddProperty,
  CreateReport,
  EditProperty,
  EditReport,
  Login,
  MessageDetails,
  PageDetails,
  Properties,
  ReportDetails,
  Reports,
  Root,
  Scans,
  Signup,
  TagDetails,
  Forgot,
  Reset,
  BulkProperty,
} from '~/routes';
import {
  addPropertyAction,
  createReportAction,
  messageDetailsLoader,
  pageDetailsLoader,
  propertiesLoader,
  propertyLoader,
  reportDetailsLoader,
  reportLoader,
  reportsLoader,
  scansLoader,
  tagDetailsLoader,
  updatePropertyAction,
  updateReportAction,
  authenticatedLoader,
} from '~/routes/route-handlers';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  },
});

initAnalytics();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Navigate to="/reports" replace /> },
      {
        path: 'reports',
        element: <Reports />,
        loader: authenticatedLoader(reportsLoader(queryClient)),
      },
      {
        path: 'reports/create',
        element: <CreateReport />,
        action: createReportAction(queryClient),
      },
      {
        path: 'reports/:reportId',
        element: <ReportDetails />,
        loader: authenticatedLoader(reportDetailsLoader(queryClient)),
      },
      {
        path: 'reports/:reportId/edit',
        element: <EditReport />,
        loader: reportLoader(queryClient),
        action: updateReportAction(queryClient),
      },
      {
        path: 'reports/:reportId/messages/:messageId',
        element: <MessageDetails />,
        loader: authenticatedLoader(messageDetailsLoader(queryClient)),
      },
      {
        path: 'reports/:reportId/tags/:tagId',
        element: <TagDetails />,
        loader: authenticatedLoader(tagDetailsLoader(queryClient)),
      },
      {
        path: 'reports/:reportId/pages/:pageId',
        element: <PageDetails />,
        loader: authenticatedLoader(pageDetailsLoader(queryClient)),
      },
      { path: 'account', element: <Account /> },
      { path: 'accessibility', element: <AccessibilityStatement /> },
      { path: 'scans', element: <Scans />, loader: authenticatedLoader(scansLoader(queryClient)) },
      {
        path: 'properties',
        element: <Properties />,
        loader: authenticatedLoader(propertiesLoader(queryClient)),
      },
      {
        path: 'properties/add',
        element: <AddProperty />,
        action: addPropertyAction(queryClient),
      },
      {
        path: 'properties/bulk',
        element: <BulkProperty />,
      },
      {
        path: 'properties/:propertyId/edit',
        element: <EditProperty />,
        loader: authenticatedLoader(propertyLoader(queryClient)),
        action: updatePropertyAction(queryClient),
      },
    ],
  },
  { path: '/login', element: <Login />, errorElement: <NotFound /> },
  { path: '/signup', element: <Signup />, errorElement: <NotFound /> },
  { path: '/forgot', element: <Forgot />, errorElement: <NotFound /> },
  { path: '/reset', element: <Reset />, errorElement: <NotFound /> },
]);

const domNode = document.getElementById('root')!;
const root = createRoot(domNode);

root.render(
  <React.StrictMode>
    <PostHogProvider
      apiKey={'phc_WuMMQol0KMzQSfbxU5l7Zv4LZHCT5EDSO89SeM4QP4O'}
      options={{ api_host: 'https://us.i.posthog.com' }}
    >
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <RouterProvider router={router} />
        </HelmetProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </PostHogProvider>
  </React.StrictMode>,
);
