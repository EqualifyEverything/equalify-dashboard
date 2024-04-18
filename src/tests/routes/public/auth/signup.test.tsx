import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SignupForm } from '~/components/forms';
import * as useAuthModule from '~/hooks/useAuth';
import { Signup } from '~/routes';
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

describe('Signup Page and Form', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth({});
  });

  it('Page renders correctly and is accessible', async () => {
    const { container } = render(<Signup />);
    expect(
      screen.getByRole('heading', { name: /Join Equalify/i }),
    ).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  describe('Signup form functionality', () => {
    beforeEach(() => {
      mockUseAuth();
    });

    it('is accessible', async () => {
      const { container } = render(<SignupForm />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('calls signUp with correct inputs', async () => {
      const signUpMock = vi.fn().mockResolvedValueOnce({});
      mockUseAuth({ signUp: signUpMock });

      const user = userEvent.setup();
      render(<Signup />);

      await user.type(
        screen.getByPlaceholderText(/E.g. johndoe@email.com/i),
        'newuser@example.com',
      );
      await user.type(
        screen.getByPlaceholderText('Your password'),
        'newPassword123',
      );
      await user.type(
        screen.getByPlaceholderText('Confirm your password'),
        'newPassword123',
      );
      await user.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(signUpMock).toHaveBeenCalledWith({
          email: 'newuser@example.com',
          password: 'newPassword123',
        });
      });
    });

    it('displays error message on signUp failure', async () => {
      const error = new Error('Signup failed');
      mockUseAuth({ signUp: vi.fn().mockRejectedValueOnce(error), error });

      const user = userEvent.setup();
      render(<Signup />);

      await user.type(screen.getByLabelText(/email/i), 'newuser@example.com');
      await user.type(screen.getByLabelText('Password'), 'new');
      await user.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(screen.getByText(error.message)).toBeInTheDocument();
      });
    });

    it('toggles password visibility', async () => {
      const user = userEvent.setup();
      render(<Signup />);

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
