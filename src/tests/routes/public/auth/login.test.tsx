import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LoginForm } from '~/components/forms';
import * as useAuthModule from '~/hooks/useAuth';
import { Login } from '~/routes';
import { render, screen, waitFor } from '../../../customRender';

vi.mock('~/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

const mockUseAuth = (overrides = {}) => {
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

expect.extend(toHaveNoViolations);

describe('Login Page and Form', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth({});
  });

  it('Page renders correctly and is accessible', async () => {
    const { container } = render(<Login />);
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  describe('Login form functionality', () => {
    beforeEach(() => {
      mockUseAuth();
    });

    it('is accessible', async () => {
      const { container } = render(<LoginForm />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('calls signIn with correct inputs', async () => {
      const signInMock = vi.fn().mockResolvedValueOnce({});
      mockUseAuth({
        signIn: signInMock,
      });

      const user = userEvent.setup();
      render(<Login />);

      await user.type(screen.getByPlaceholderText(/E.g. johndoe@email.com/i), 'user@example.com');
      await user.type(screen.getByPlaceholderText(/Your password/i), 'password');
      await user.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(signInMock).toHaveBeenCalledWith({
          username: 'user@example.com',
          password: 'password',
        });
      });
    });

    it('displays error message on signIn failure', async () => {
      const error = new Error('Login failed');
      mockUseAuth({ signIn: vi.fn().mockRejectedValueOnce(error), error });

      const user = userEvent.setup();
      render(<Login />);

      await user.type(screen.getByLabelText(/email/i), 'user@example.com');
      await user.type(screen.getByLabelText('Password'), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(screen.getByText(error.message)).toBeInTheDocument();
      });
    });

    it('shows loading state when signIn is being processed', async () => {
      mockUseAuth({ loading: true });

      render(<Login />);
      expect(screen.getByText(/processing, please wait/i)).toBeInTheDocument();
    });

    it('toggles password visibility', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const passwordInput = screen.getByPlaceholderText('Your password');
      expect(passwordInput).toHaveAttribute('type', 'password');

      const toggleVisibilityButton = screen.getByLabelText(/Show password/i);

      await user.click(toggleVisibilityButton);
      expect(passwordInput).toHaveAttribute('type', 'text');

      await user.click(toggleVisibilityButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });
});
