import { Toaster } from '~/components/alerts/toast';
import { Announcer, AuthHeader, MaxWidthWrapper } from '..';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Toaster richColors />
    <Announcer />
    <AuthHeader />
    <main className="min-h-[calc(100svh-(65px))] bg-[#e9ecef]">
      <MaxWidthWrapper className="py-12 md:h-[calc(100svh-(65px))]">
        {children}
      </MaxWidthWrapper>
    </main>
  </>
);

export default AuthLayout;
