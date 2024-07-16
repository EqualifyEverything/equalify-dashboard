import { LoginForm } from '~/components/forms';
import { AuthLayout } from '~/components/layout';
import SEO from '~/components/layout/seo';
import { Public } from '../..';

const Login = () => (
  <Public>
    <AuthLayout>
      <SEO
        title="Login - Equalify"
        description="Log in to your Equalify account to manage your properties and reports."
        url="https://www.equalify.dev/login"
      />
      <section className="flex h-full w-full flex-col items-center justify-center gap-10">
        <div className="w-full max-w-md space-y-2">
          <h1 className="text-3xl md:text-[2.5rem]">Login</h1>
          <h2 className="text-base text-[#4D4D4D]">
            Welcome back to Equalify! Please sign in:{' '}
            <span role="img" aria-hidden="true">
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
