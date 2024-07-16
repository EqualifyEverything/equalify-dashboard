import { useEffect } from 'react';
import * as Sentry from '@sentry/react';
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';

export const initSentry = () => {
  Sentry.init({
    dsn: 'https://112c460e345c63d48a31d31d5fe4bdaf@o4507609414893568.ingest.us.sentry.io/4507609418301440',
    integrations: [
      Sentry.reactRouterV6BrowserTracingIntegration({
        useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),
      Sentry.replayIntegration(),
      Sentry.feedbackIntegration({
        showBranding: false,
        colorScheme: 'light',
        themeLight: {
          accentBackground: '#186121',
        },
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0,
    tracePropagationTargets: ['localhost', /^https:\/\/managed\.equalify\.app/],
    // Session Replay
    replaysSessionSampleRate: 0.1, 
    replaysOnErrorSampleRate: 1.0, 
  });
};
