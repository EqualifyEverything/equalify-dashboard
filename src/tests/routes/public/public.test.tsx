import { describe, expect, it, vi } from 'vitest';

import * as useAuthModule from '~/hooks/useAuth';
import { Login, Public, Signup } from '~/routes';
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

describe('Public Routes', () => {
  it('renders Login page for unauthenticated users', async () => {
    mockUseAuth({ isAuthenticated: false });

    render(<Login />, {
      routeOptions: {
        routes: [
          {
            path: '/login',
            element: (
              <Public>
                <Login />
              </Public>
            ),
          },
          {
            path: '/signup',
            element: (
              <Public>
                <Signup />
              </Public>
            ),
          },
        ],
        initialEntries: ['/login'],
      },
    });

    const heading = await screen.findByRole('heading', {
      name: /login/i,
      level: 1,
    });
    expect(heading).toBeInTheDocument();
  });

  it('renders Signup page for unauthenticated users', async () => {
    mockUseAuth({ isAuthenticated: false });

    render(<Signup />, {
      routeOptions: {
        routes: [
          {
            path: '/login',
            element: (
              <Public>
                <Login />
              </Public>
            ),
          },
          {
            path: '/signup',
            element: (
              <Public>
                <Signup />
              </Public>
            ),
          },
        ],
        initialEntries: ['/signup'],
      },
    });

    const heading = await screen.findByRole('heading', {
      name: /join equalify/i,
      level: 1,
    });
    expect(heading).toBeInTheDocument();
  });
});
