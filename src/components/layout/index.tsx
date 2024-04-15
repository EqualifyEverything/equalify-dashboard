import Footer from './footer';
import Header from './header';
import MaxWidthWrapper from './max-width-wrapper';

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Header />
    <main className="h-[calc(100svh-(130px))] bg-[#e9ecef]">
      <MaxWidthWrapper>{children}</MaxWidthWrapper>
    </main>
    <Footer />
  </>
);

export default RootLayout;
