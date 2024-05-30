import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';

function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Navigate
            to="/"
            state={{ from: location }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;