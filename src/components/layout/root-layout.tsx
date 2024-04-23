import { Footer, Header, MaxWidthWrapper } from '.';

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Header />
    <main className="min-h-[calc(100svh-(130px))] flex flex-col bg-[#e9ecef]">
      <MaxWidthWrapper className="flex-1 py-12">
        {children}
      </MaxWidthWrapper>
    </main>
    <Footer />
  </>
);

export default RootLayout;
