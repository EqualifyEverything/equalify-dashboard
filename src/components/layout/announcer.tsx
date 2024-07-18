import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Announcer: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const pageName =
      location.pathname.split('/').filter(Boolean).join(' ') || 'Home';
    const announcer = document.getElementById('page-announcer');
    if (announcer) {
      announcer.textContent = `${pageName} page loaded`;
    }
  }, [location]);

  return (
    <div
      id="page-announcer"
      aria-live="assertive"
      className="absolute left-[-9999px] size-[1px] overflow-hidden"
    />
  );
};

export default Announcer;
