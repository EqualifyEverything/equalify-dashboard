import { SignupForm } from '~/components/forms';
import { AuthLayout, SEO } from '~/components/layout';
import Public from '../public';

const Signup = () => (
  <Public>
    <AuthLayout>
      <SEO
        title="Signup - Equalify"
        description="Join Equalify to start making your website accessible to everyone."
        url="https://www.equalify.dev/signup"
      />
      <section className="flex h-full w-full flex-col items-center justify-center gap-10">
        <div className="w-full max-w-md space-y-2">
          <h1 className="text-3xl md:text-[2.5rem]">Join Equalify</h1>
          <h2 className="text-base text-[#4D4D4D]">
            Fill out this form to begin your journey towards a more accessible
            world. Let's make accessibility a norm, together!{' '}
            <span role="img" aria-hidden="true">
              ✨
            </span>
          </h2>
        </div>
        <SignupForm />
      </section>
    </AuthLayout>
  </Public>
);

export default Signup;
