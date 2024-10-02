import type {
  AuthError,
  ConfirmSignUpInput,
  SignInInput,
} from 'aws-amplify/auth';
import { useCallback, useEffect } from 'react';
import {
  confirmSignUp as authConfirmSignUp,
  deleteUser as authDeleteUser,
  resendSignUpCode as authResendSignUpCode,
  signIn as authSignIn,
  signOut as authSignOut,
  signUp as authSignUp,
  updateUserAttributes as authUpdateUserAttributes,
  autoSignIn,
  fetchUserAttributes,
  getCurrentUser,
} from 'aws-amplify/auth';
import { del, post } from 'aws-amplify/api';

import { useStore } from '~/store';

interface SignUpParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface UpdateUserParams {
  firstName: string;
  lastName: string;
}

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    needsConfirmation,
    pendingUsername,
    loading,
    error,
    setUser,
    setIsAuthenticated,
    setNeedsConfirmation,
    setPendingUsername,
    setLoading,
    setError,
    clearAuth,
  } = useStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    needsConfirmation: state.needsConfirmation,
    pendingUsername: state.pendingUsername,
    loading: state.loading,
    error: state.error,
    setUser: state.setUser,
    setIsAuthenticated: state.setIsAuthenticated,
    setNeedsConfirmation: state.setNeedsConfirmation,
    setPendingUsername: state.setPendingUsername,
    setLoading: state.setLoading,
    setError: state.setError,
    clearAuth: state.clearAuth,
  }));

  const transformAndSetUser = useCallback(async () => {
    setLoading(true);
    try {
      const authUser = await getCurrentUser();
      if (authUser) {
        const attributes = await fetchUserAttributes();
        const transformedUser = {
          userId: authUser.userId,
          email: authUser.signInDetails?.loginId ?? '',
          firstName: attributes.given_name ?? '',
          lastName: attributes.family_name ?? '',
        };
        setUser(transformedUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [setUser, setIsAuthenticated, setLoading]);

  const handleError = useCallback(
    (error: AuthError | unknown, message = '') => {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error(message, error);
      setError(err);
      setLoading(false);
    },
    [setError, setLoading],
  );

  const clearErrors = useCallback(() => {
    setError(null);
  }, [setError]);

  useEffect(() => {
    transformAndSetUser();
  }, [transformAndSetUser]);

  const signUp = useCallback(
    async ({ password, email, firstName, lastName }: SignUpParams) => {
      setLoading(true);
      try {
        const { isSignUpComplete, nextStep } = await authSignUp({
          username: email,
          password,
          options: {
            userAttributes: {
              email,
              given_name: firstName,
              family_name: lastName,
            },
            autoSignIn: true,
          },
        });

        if (!isSignUpComplete && nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
          setNeedsConfirmation(true);
          setPendingUsername(email);
          return true
        } else {
          console.warn('Unexpected sign-up flow:', nextStep);
          return false
        }
      } catch (error) {
        handleError(error, 'Error signing up:');
        return false
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setNeedsConfirmation, setPendingUsername, handleError],
  );

  const confirmSignUp = useCallback(
    async ({ username, confirmationCode }: ConfirmSignUpInput) => {
      setLoading(true);
      try {
        const { isSignUpComplete, nextStep } = await authConfirmSignUp({
          username,
          confirmationCode,
        });

        if (
          isSignUpComplete &&
          nextStep.signUpStep === 'COMPLETE_AUTO_SIGN_IN'
        ) {
          const { isSignedIn } = await autoSignIn();
          if (isSignedIn) {
            setTimeout(async () => {
              await transformAndSetUser();
              setIsAuthenticated(true);
              setNeedsConfirmation(false);
              setPendingUsername(null);
              await post({ apiName: 'auth', path: '/track/user' }).response;
            }, 1000);
            return { isSignUpComplete: true }
          }
        } else {
          console.warn('Unexpected confirmation flow:', nextStep);
          return { isSignUpComplete: false }
        }
      } catch (error) {
        handleError(error, 'Error confirming sign up:');
        return { isSignUpComplete: false }
      } finally {
        setLoading(false);
      }
    },
    [setLoading, transformAndSetUser, setIsAuthenticated, handleError],
  );

  const cancelConfirmation = useCallback(() => {
    setNeedsConfirmation(false);
    setPendingUsername(null);
    clearErrors();
  }, [setNeedsConfirmation, setPendingUsername, clearErrors]);

  const resendSignUpCode = useCallback(
    async (username: string) => {
      setLoading(true);
      try {
        const { destination, deliveryMedium } = await authResendSignUpCode({
          username,
        });
        console.log(
          `Resend sign-up code successful. Code sent via ${deliveryMedium} to ${destination}.`,
        );
      } catch (error) {
        handleError(error, 'Error resending sign-up code:');
      } finally {
        setLoading(false);
      }
    },
    [handleError, setLoading],
  );

  const signIn = useCallback(
    async ({ username, password }: SignInInput) => {
      setLoading(true);
      try {
        const { isSignedIn, nextStep } = await authSignIn({
          username,
          password,
        });
        if (isSignedIn) {
          setTimeout(async () => {
            await transformAndSetUser();
            setIsAuthenticated(true);
          }, 1000);
          return { success: true };
        } else {
          switch (nextStep.signInStep) {
            case 'DONE':
              await transformAndSetUser();
              setIsAuthenticated(true);
              return { success: true };
            case 'CONFIRM_SIGN_UP':
              setNeedsConfirmation(true);
              setPendingUsername(username);
              return { success: false, confirmationRequired: true };
            default:
              console.error('Unhandled sign-in step:', nextStep.signInStep);
              return { success: false };
          }
        }
      } catch (error) {
        handleError(error, 'Error signing in:');
        return { success: false };
      } finally {
        setLoading(false);
      }
    },
    [
      transformAndSetUser,
      setIsAuthenticated,
      setNeedsConfirmation,
      setPendingUsername,
      setLoading,
      handleError,
    ],
  );

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await authSignOut();
      clearAuth();
    } catch (error) {
      handleError(error, 'Error signing out:');
    } finally {
      setLoading(false);
    }
  }, [clearAuth, handleError, setLoading]);

  const updateUserAttributes = useCallback(
    async ({ firstName, lastName }: UpdateUserParams) => {
      setLoading(true);
      try {
        await authUpdateUserAttributes({
          userAttributes: {
            given_name: firstName,
            family_name: lastName,
          },
        });
        await transformAndSetUser();
      } catch (error) {
        handleError(error, 'Error updating user attributes:');
      } finally {
        setLoading(false);
      }
    },
    [setLoading, transformAndSetUser, handleError],
  );

  const deleteUser = useCallback(async () => {
    setLoading(true);
    try {
      await del({ apiName: 'auth', path: '/delete/user' }).response;
      await authDeleteUser();
      clearAuth();
    } catch (error) {
      handleError(error, 'Error deleting user:');
    } finally {
      setLoading(false);
    }
  }, [clearAuth, handleError, setLoading]);

  return {
    signUp,
    confirmSignUp,
    cancelConfirmation,
    resendSignUpCode,
    signIn,
    signOut,
    clearErrors,
    updateUserAttributes,
    deleteUser,
    user,
    isAuthenticated,
    needsConfirmation,
    pendingUsername,
    error,
    loading,
  };
};
