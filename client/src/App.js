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
      <Route path="/factura" element={<CrearFactura />} />
      <Route path="/home" element={<PaginaHome />} />
      <Route path="*" element={<Error404 />} />
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
