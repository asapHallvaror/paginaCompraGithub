import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProvideAuth } from './auth/AuthContext';
import Login from './Pages/Login';
import CrearFactura from './Pages/CrearFactura';
import PaginaHome from './Pages/PaginaHome';
import PrivateRoute from './PrivateRoute';
import Error404 from './Pages/Error404';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/factura" element={<PrivateRoute />}>
        <Route path="/factura" element={<CrearFactura />} />
      </Route>
      <Route path="/home" element={<PrivateRoute />}>
        <Route path="/home" element={<PaginaHome />} />
      </Route>
      <Route path="*" element={<PrivateRoute />}>
        <Route path="*" element={<Error404 />} />
      </Route>

    </Routes>
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
