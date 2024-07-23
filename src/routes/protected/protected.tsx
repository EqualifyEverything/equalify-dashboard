import { Navigate } from 'react-router-dom';
import { useAuth } from '~/hooks/useAuth';

const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default Protected;
