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

import { ErrorAlert } from '~/components/alerts';
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

const SignupSchema = z
  .object({
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

type SignupFormInputs = z.infer<typeof SignupSchema>;

const SignupForm = () => {
  const errorAlertRef = useRef<HTMLDivElement>(null);
  const {
    signUp,
    loading,
    error: signUpError,
    needsConfirmation,
    pendingUsername,
  } = useAuth();

  const form = useForm<SignupFormInputs>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: SignupFormInputs) => {
    try {
      await signUp({
        password: values.password,
        email: values.email,
      });
    } catch (error) {
      console.error('Sign up error on Submit:', error);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  useEffect(() => {
    if (signUpError) errorAlertRef.current?.focus();
  }, [signUpError]);

  if (needsConfirmation && pendingUsername) {
    return <OTPValidationForm email={pendingUsername} />;
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-4"
        >
          {signUpError && (
            <ErrorAlert
              error={signUpError.message}
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
                    placeholder="E.g. johndoe@email.com"
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
                      placeholder="Your password"
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="confirm-password">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      className="h-12 bg-white"
                      id="confirm-password"
                      {...field}
                    />
                    <Button
                      type="button"
                      size="icon"
                      aria-label={
                        showPassword
                          ? 'Hide confirm password'
                          : 'Show confirm password'
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
              Already have an account?{' '}
              <Link
                to="/login"
                className="group inline-flex items-end gap-1 font-semibold text-[#1D781D] hover:underline"
              >
                Log in
                <ArrowTopRightIcon className="group-hover:scale-110" />
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </>
  );
};

export default SignupForm;
