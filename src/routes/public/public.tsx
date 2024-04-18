import { Navigate } from 'react-router-dom';

import { useAuth } from '~/hooks/useAuth';

const Public: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
};

export default Public;
