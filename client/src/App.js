import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProvideAuth } from './auth/AuthContext';
import Login from './Pages/Login';
import CrearFactura from './Pages/CrearFactura';
import PaginaHome from './Pages/PaginaHome';
import PrivateRoute from './PrivateRoute';
import PaginaDetFac from './Pages/PaginaDetFac';
import Error404 from './Pages/Error404';
import RectificarFactura from './Pages/PaginaRectificarFactura'
import PaginaCambiarEst from './Pages/PaginaCambiarEst';
import PaginaHistorial from './Pages/PaginaHistorial';
import ComponenteImagen from './Pages/ComponenteImagen';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/factura" element={<CrearFactura />} />
      <Route path="/home" element={<PaginaHome />} />
      <Route path="/detalle/:id" element={<PaginaDetFac />} />
      <Route path="/rectificar/:id" element={<RectificarFactura />} />
      <Route path="/cambiarestado/:id" element={<PaginaCambiarEst />} />
      <Route path="/historialcambios/:id" element={<PaginaHistorial />} />
      <Route path="/imagen/:id" element={<ComponenteImagen />} />

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
