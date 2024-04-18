import { Footer, Header, MaxWidthWrapper } from '.';

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Header />
    <main className="min-h-[calc(100svh-(130px))] bg-[#e9ecef]">
      <MaxWidthWrapper className="h-[calc(100svh-(130px))] py-12">
        {children}
      </MaxWidthWrapper>
    </main>
    <Footer />
  </>
);

export default RootLayout;
