import { Toasts } from '~/components/alerts/toast';
import { Announcer, Footer, Header, MaxWidthWrapper } from '.';

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Toasts>
      <Announcer />
      <Header />
      <main className="flex min-h-[calc(100svh-(130px))] flex-col bg-[#e9ecef]">
        <MaxWidthWrapper className="flex-1 py-12">{children}</MaxWidthWrapper>
      </main>
      <Footer />
    </Toasts>
  </>
);

export default RootLayout;
