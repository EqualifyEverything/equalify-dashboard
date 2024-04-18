import { describe, expect, it, vi } from 'vitest';

import * as useAuthModule from '~/hooks/useAuth';
import { Account, Login, Protected } from '~/routes';
import { render, screen } from '../../customRender';

vi.mock('~/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

const mockUseAuth = (
  overrides: Partial<ReturnType<typeof useAuthModule.useAuth>>,
) => {
  vi.mocked(useAuthModule.useAuth).mockReturnValue({
    signUp: vi.fn(),
    confirmSignUp: vi.fn(),
    resendSignUpCode: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    deleteUser: vi.fn(),
    user: null,
    isAuthenticated: false,
    needsConfirmation: false,
    pendingUsername: null,
    loading: false,
    error: null,
    ...overrides,
  });
};

describe('Protected Routes', () => {
  describe('Account Page', () => {
    it('redirects to login when user is not authenticated', async () => {
      mockUseAuth({ isAuthenticated: false });

      render(<Account />, {
        routeOptions: {
          routes: [
            {
              path: '/account',
              element: (
                <Protected>
                  <Account />
                </Protected>
              ),
            },
            {
              path: '/login',
              element: <Login />,
            },
          ],
          initialEntries: ['/account'],
        },
      });

      const heading = await screen.findByRole('heading', {
        name: /login/i,
        level: 1,
      });
      expect(heading).toBeInTheDocument();
    });

    it('renders the account page when user is authenticated', async () => {
      mockUseAuth({ isAuthenticated: true });

      render(<Account />, {
        routeOptions: {
          routes: [
            {
              path: '/account',
              element: (
                <Protected>
                  <Account />
                </Protected>
              ),
            },
            {
              path: '/login',
              element: <Login />,
            },
          ],
          initialEntries: ['/account'],
        },
      });

      const heading = await screen.findByRole('heading', {
        name: /your account/i,
        level: 1,
      });
      expect(heading).toBeInTheDocument();
    });
  });
});
