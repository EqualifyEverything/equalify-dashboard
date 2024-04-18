import { Link } from 'react-router-dom';

import { MaxWidthWrapper } from '..';

const Header = () => (
  <header className="border-b border-gray-300 bg-white">
    <MaxWidthWrapper>
      <div className="flex h-16 items-center">
        <Link to="/" aria-label="Go to homepage" rel="home">
          <img
            src="/equalify.svg"
            className="h-auto w-28 md:w-32"
            width={128}
            height="auto"
            alt="Equalify Logo"
          />
        </Link>
      </div>
    </MaxWidthWrapper>
  </header>
);

export default Header;
