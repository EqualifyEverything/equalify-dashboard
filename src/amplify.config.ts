import { Amplify } from 'aws-amplify';
import * as Auth from 'aws-amplify/auth';

const generateHeaders = async (apiKeyRequired: boolean) => {
  const session = await Auth.fetchAuthSession();
  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.tokens?.idToken?.toString()}`,
  };

  if (apiKeyRequired) {
    headers['X-Api-Key'] = '1';
  }

  return headers;
};

Amplify.configure(
  {
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
  },
  {
    API: {
      GraphQL: {
        headers: () => generateHeaders(false),
      },
      REST: {
        headers: async ({ apiName }) => {
          const apiKeyRequired = apiName !== 'auth';
          return generateHeaders(apiKeyRequired);
        },
      },
    },
  },
);
