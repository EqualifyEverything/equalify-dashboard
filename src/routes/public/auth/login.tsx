import { LoginForm } from '~/components/forms';
import { AuthLayout } from '~/components/layout';
import { Public } from '../..';

const Login = () => (
  <Public>
    <AuthLayout>
      <section className="flex h-full w-full flex-col items-center justify-center gap-10">
        <div className="w-full max-w-md space-y-2">
          <h1 className="text-3xl md:text-[2.5rem]">Login</h1>
          <h2 className="text-base text-[#4D4D4D]">
            Welcome back to Equalify, where accessibility is for{' '}
            <span role="img" aria-label="everyone">
              everyone
            </span>
            !{' '}
            <span role="img" aria-label="waving hand">
              👋
            </span>
          </h2>
        </div>

        <LoginForm />
      </section>
    </AuthLayout>
  </Public>
);

export default Login;
