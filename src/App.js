import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProvideAuth } from './auth/AuthContext';
import Login from './Pages/Login';
import CrearFactura from './Pages/CrearFactura';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/factura" element={<PrivateRoute />}>
        <Route path="/factura" element={<CrearFactura />} />
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
