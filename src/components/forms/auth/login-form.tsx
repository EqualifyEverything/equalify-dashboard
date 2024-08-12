import { useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowTopRightIcon,
  EyeClosedIcon,
  EyeOpenIcon,
} from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';

import { ErrorAlert, toast } from '~/components/alerts';
import { Button } from '~/components/buttons';
import { Input } from '~/components/inputs';
import { useAuth } from '~/hooks/useAuth';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  OTPValidationForm,
} from '..';

const LoginSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(1, {
    message: "Password can't be empty.",
  }),
});

type LoginFormInputs = z.infer<typeof LoginSchema>;

const LoginForm = () => {
  const errorAlertRef = useRef<HTMLDivElement>(null);
  const {
    signIn,
    loading,
    error: signInError,
    clearErrors,
    needsConfirmation,
    cancelConfirmation,
    pendingUsername,
  } = useAuth();

  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormInputs) => {
    try {
      const { success, confirmationRequired } = await signIn({
        username: values.email,
        password: values.password,
      });

      if (success) {
        toast.success({
          title: 'Success',
          description: 'Login successful. Redirecting to reports page.',
        });
      } else if (confirmationRequired) {
        toast.success({
          title: 'Success',
          description:
            'Email not confirmed. A code has been sent to your email.',
        });
      }
    } catch (error) {
      toast.error({
        title: 'Success',
        description: 'Login failed. Please try again.',
      });
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  useEffect(() => {
    if (signInError) errorAlertRef.current?.focus();
  }, [signInError]);

  useEffect(() => {
    return () => {
      clearErrors();
      cancelConfirmation();
    };
  }, [clearErrors, cancelConfirmation]);

  if (needsConfirmation && pendingUsername) {
    return <OTPValidationForm email={pendingUsername} type="login" />;
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-4"
        >
          {signInError && (
            <ErrorAlert
              error={signInError.message}
              className="mb-4"
              ref={errorAlertRef}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    className="h-12 bg-white"
                    id="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="password">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      className="h-12 bg-white"
                      id="password"
                      {...field}
                    />
                    <Button
                      type="button"
                      size="icon"
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                      aria-pressed={showPassword}
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent text-gray-500 shadow-none"
                    >
                      {showPassword ? (
                        <EyeOpenIcon aria-hidden />
                      ) : (
                        <EyeClosedIcon aria-hidden />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-4">
            <Button
              type="submit"
              className="h-12 w-full bg-[#1D781D] text-white"
              disabled={loading}
              aria-live="polite"
              aria-label={loading ? 'Processing,please wait' : 'Continue'}
            >
              {loading ? (
                <>
                  <span className="sr-only">Processing, please wait...</span>
                  <div
                    role="status"
                    className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"
                  ></div>
                </>
              ) : (
                'Continue'
              )}
            </Button>

            <p className="text-center text-sm text-[#4D4D4D]">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="group inline-flex items-end gap-1 font-semibold text-[#1D781D] hover:underline"
              >
                Sign up
                <ArrowTopRightIcon className="group-hover:scale-110" />
              </Link>
            </p>
            <p className="text-center text-sm text-[#4D4D4D]">
              Forgot your password?{' '}
              <Link
                to="/forgot"
                className="group inline-flex items-end gap-1 font-semibold text-[#1D781D] hover:underline"
              >
                Reset Now
                <ArrowTopRightIcon className="group-hover:scale-110" />
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </>
  );
};

export default LoginForm;
