import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';

function PrivateRoute() {
  const auth = useAuth();

  return auth.user ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoute;
