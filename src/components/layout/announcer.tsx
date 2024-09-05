import { useEffect, useRef } from 'react';
import { useLocation, matchPath } from 'react-router-dom';

const routeNames: Record<string, string> = {
 '/reports': 'Reports',
  '/reports/create': 'Create Report',
  '/reports/:reportId': 'Report Details',
  '/reports/:reportId/edit': 'Edit Report',
  '/reports/:reportId/messages/:messageId': 'Message Details',
  '/reports/:reportId/tags/:tagId': 'Tag Details',
  '/reports/:reportId/pages/:pageId': 'Page Details',
  '/account': 'Account',
  '/scans': 'Scans',
  '/properties': 'Properties',
  '/properties/add': 'Add Property',
  '/properties/:propertyId/edit': 'Edit Property',
  '/login': 'Login',
  '/signup': 'Signup',
  '/forgot': 'Forgot Password',
  '/reset': 'Reset Password',
  '/accessibility': 'Equalify Accessibility Statement',
};


const getPageName = (pathname: string) => {
  for (const [pattern, name] of Object.entries(routeNames)) {
    if (matchPath(pattern, pathname)) {
      return name;
    }
  }
  return 'Reports';
};


const Announcer: React.FC = () => {
  const location = useLocation();
  const announcer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pageName = getPageName(location.pathname);
    if (announcer.current) {
      announcer.current.textContent = `${pageName} page loaded`;
      announcer.current.focus({ preventScroll: true });
    }
  }, [location]);

  return (
    <div
    ref={announcer}
    tabIndex={-1}
      id="page-announcer"
      className="sr-only"
    />
  );
};

export default Announcer;
