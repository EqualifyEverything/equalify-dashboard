import posthog from 'posthog-js';

const siteId = "phc_WuMMQol0KMzQSfbxU5l7Zv4LZHCT5EDSO89SeM4QP4O"
const apiHost = "https://us.i.posthog.com"


export const initPostHog = () => {
    posthog.init(siteId, {
      api_host: apiHost,
      capture_pageview: false,
    });
  };