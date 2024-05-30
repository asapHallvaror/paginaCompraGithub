import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import './PaginaLogin.css';
import logo from '../Assets/YZY MUSIC.png'


const Login = () => {
  const [rutEmpresa, setRutEmpresa] = useState('');
  const [password, setPassword] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false); // Define modalAbierto and setModalAbierto
  const navigate = useNavigate();

  const abrirModal = () => setModalAbierto(true); // Define abrirModal
  const cerrarModal = () => setModalAbierto(false); // Define cerrarModal

  const handleLogin = (event) => {
    event.preventDefault();

    if (rutEmpresa === 'rutValido' && password === 'contraseñaValida') {
      // Navigate to the CrearFactura page
      navigate('/CrearFactura');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <img src={logo} alt="" className='logo-lindo'/>
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="rutEmpresa">RUT Empresa:</label>
            <input type="text" id="rutEmpresa" name="rutEmpresa" value={rutEmpresa} onChange={(e) => setRutEmpresa(e.target.value)} placeholder="RUT Empresa" required className='login-inputs-bonitos'/>
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" required className='login-inputs-bonitos'/>
          </div>
          <Link to={'/factura'}>
            <button type="submit" className='boton-inferior'><span>Iniciar sesión</span></button>
          </Link>
          <p className='olvidaste-p' onClick={abrirModal}>¿Olvidaste tu contraseña?</p> {/* Agregar onClick para abrir la ventana modal */}
        </form>
      </div>
      <div className={`modal ${modalAbierto ? 'mostrar' : ''}`}> {/* Agregar la clase 'mostrar' si modalAbierto es true */}
        <div className="modal-contenido">
          <button className="cerrar" onClick={cerrarModal}>×</button> {/* Botón de cerrar */}
          <h3>Recuperar contraseña</h3>
          <form>
            <div className="form-group">
              <p>Ingresa el correo registrado, te mandaremos un correo para que puedas restablecer tu contraseña.</p>
              <label htmlFor="correo">Correo electrónico:</label>
              <input type="email" id="correo" name="correo" placeholder="Correo electrónico" required className='login-inputs-bonitos'/>
            </div>
            <button type="submit">Enviar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;