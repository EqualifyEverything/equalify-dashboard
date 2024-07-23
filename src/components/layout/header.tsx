import { Link, NavLink } from 'react-router-dom';

import { MaxWidthWrapper } from '.';

const routes = [
  { name: 'Reports', path: '/reports' },
  { name: 'Scans', path: '/scans' },
  { name: 'Properties', path: '/properties' },
  { name: 'My Account', path: '/account' },
];

const Header = () => {
  return (
    <header className="border-b border-gray-300 bg-white">
      <MaxWidthWrapper>
        <div className="flex flex-col items-center justify-between gap-3 py-3 md:h-16 md:flex-row">
          <Link to="/reports" replace aria-label="Go to homepage" rel="home">
            <img
              src="/equalify.svg"
              className="h-auto w-28 md:w-32"
              width={128}
              height="auto"
              alt="Equalify Logo"
            />
          </Link>
          <nav>
            <ul className="flex gap-4">
              {routes.map((route) => (
                <li key={route.path}>
                  <NavLink
                    to={route.path}
                    className={({ isActive }) =>
                      isActive
                        ? 'font-semibold text-[#186121] transition-colors focus:text-[#186121]'
                        : 'text-slate-500 transition-colors hover:text-[#186121] focus:text-slate-600'
                    }
                  >
                    {route.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </MaxWidthWrapper>
    </header>
  );
};

export default Header;
