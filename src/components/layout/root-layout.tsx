import { Toaster } from '~/components/alerts/toast';
import { Footer, Header, MaxWidthWrapper, Announcer } from '.';

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Toaster richColors />
    <Announcer />
    <Header />
    <main className="flex min-h-[calc(100svh-(130px))] flex-col bg-[#e9ecef]">
      <MaxWidthWrapper className="flex-1 py-12">{children}</MaxWidthWrapper>
    </main>
    <Footer />
  </>
);

export default RootLayout;
