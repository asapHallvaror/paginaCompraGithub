import './App.css';
import { BrowserRouter, useRoutes, Navigate } from 'react-router-dom';
import { ProvideAuth, useAuth } from './auth/AuthContext';
import Login from './Pages/Login';
import CrearFactura from './Pages/CrearFactura';

function App() {
  const auth = useAuth();

  let routes = useRoutes([
    {
      path: '/',
      element: <Login />,
    },
    {
      path: '/factura',
      element: auth.user ? <CrearFactura /> : <Navigate to="/" />,
    },
  ]);

  return (
    <div>
      {routes}
    </div>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <ProvideAuth>
        <App />
      </ProvideAuth>
    </BrowserRouter>
  );
}

export default AppWrapper;