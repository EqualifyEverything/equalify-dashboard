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
  autoSignIn,
  getCurrentUser,
  fetchAuthSession,
} from 'aws-amplify/auth';

import { useStore } from '~/store';

interface SignUpParams {
  email: string;
  password: string;
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
    const authUser = await getCurrentUser();
    if (authUser) {
      const attributes = (await fetchAuthSession({ forceRefresh: true })).tokens?.idToken?.payload;
      const transformedUser = {
        userId: authUser.userId,
        email: authUser.signInDetails?.loginId ?? '',
        firstName: attributes.given_name ?? '',
        lastName: attributes.family_name ?? ''
      };
      setUser(transformedUser);
    } else {
      setUser(null);
    }
  }, [setUser]);

  const handleError = useCallback(
    (error: AuthError | unknown, message = '') => {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error(message, error);
      setError(err);
      setLoading(false);
    },
    [setError, setLoading],
  );

  useEffect(() => {
    const checkCurrentUser = async () => {
      setLoading(true);
      try {
        await transformAndSetUser();
        setIsAuthenticated(true);
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkCurrentUser();
  }, [transformAndSetUser, setIsAuthenticated, setLoading, handleError]);

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
            }, autoSignIn: true
          },
        });

        if (!isSignUpComplete && nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
          setNeedsConfirmation(true);
          setPendingUsername(email);
        } else {
          console.warn('Unexpected sign-up flow:', nextStep);
        }
      } catch (error) {
        handleError(error, 'Error signing up:');
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
            await transformAndSetUser();
            setIsAuthenticated(true);
            setNeedsConfirmation(false);
            setPendingUsername(null);
          }
        } else {
          console.warn('Unexpected confirmation flow:', nextStep);
        }
      } catch (error) {
        handleError(error, 'Error confirming sign up:');
      } finally {
        setLoading(false);
      }
    },
    [setLoading, transformAndSetUser, setIsAuthenticated, handleError],
  );

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
          await transformAndSetUser();
          setIsAuthenticated(true);
        } else {
          switch (nextStep.signInStep) {
            case 'DONE':
              await transformAndSetUser();
              setIsAuthenticated(true);
              break;
            case 'CONFIRM_SIGN_UP':
              setNeedsConfirmation(true);
              setPendingUsername(username);
              break;
            default:
              console.error('Unhandled sign-in step:', nextStep.signInStep);
          }
        }
      } catch (error) {
        handleError(error, 'Error signing in:');
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

  const deleteUser = useCallback(async () => {
    setLoading(true);
    try {
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
    resendSignUpCode,
    signIn,
    signOut,
    deleteUser,
    user,
    isAuthenticated,
    needsConfirmation,
    pendingUsername,
    error,
    loading,
  };
};
