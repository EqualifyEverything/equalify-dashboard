import { axe, toHaveNoViolations } from 'jest-axe';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AccountForm } from '~/components/forms';
import * as useAuthModule from '~/hooks/useAuth';
import { Account } from '~/routes';
import { render, screen } from '../../customRender';

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

describe('Account Page and Form', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      mockUseAuth();
    });
  
    it('renders correctly and is accessible', async () => {
      const { container } = render(<Account />);
      expect(screen.getByText('Your Account')).toBeInTheDocument();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('form inputs are present and disabled', async () => {
        mockUseAuth({user: {email: 'johndoe@example.com'}});
        render(<AccountForm />);
        const firstNameInput = screen.getByRole('textbox', { name: /first name/i });
        expect(firstNameInput).toBeDisabled();
      
        const lastNameInput = screen.getByRole('textbox', { name: /last name/i });
        expect(lastNameInput).toBeDisabled();
      
        const emailInput = await screen.findByRole('textbox', { name: /email/i });
        expect(emailInput).toHaveValue('johndoe@example.com');
        expect(emailInput).toBeDisabled();
      });
    
      it('update account button is present and disabled', () => {
        render(<AccountForm />);
        const updateButton = screen.getByRole('button', { name: /Update Account/i });
        expect(updateButton).toBeInTheDocument();
        expect(updateButton).toBeDisabled();
      });



});