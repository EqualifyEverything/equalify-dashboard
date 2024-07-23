import { initHotjar } from './hotjar';
import { initPostHog } from './posthog';
import { initSentry } from './sentry';

export const initAnalytics = () => {
  initSentry();
  initHotjar();
  initPostHog();
};