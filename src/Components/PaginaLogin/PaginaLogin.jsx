import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaginaLogin.css';
import { useAuth } from '../../auth/AuthContext'; 
import logo from '../Assets/YZY MUSIC.png';

const Login = () => {
  const [rutEmpresa, setRutEmpresa] = useState('');
  const [password, setPassword] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  const abrirModal = () => setModalAbierto(true);
  const cerrarModal = () => setModalAbierto(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    const user = await auth.signin(rutEmpresa, password);

    if (user) {
      // Guardar el estado de inicio de sesión en localStorage
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/factura');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <img src={logo} alt="Logo" className='logo-lindo'/>
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="rutEmpresa">RUT Empresa:</label>
            <input
              type="text"
              id="rutEmpresa"
              name="rutEmpresa"
              value={rutEmpresa}
              onChange={(e) => setRutEmpresa(e.target.value)}
              placeholder="RUT Empresa"
              required
              className='login-inputs-bonitos'
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              className='login-inputs-bonitos'
            />
          </div>
          <button type="submit" className='boton-inferior'><span>Iniciar sesión</span></button>
          <p className='olvidaste-p' onClick={abrirModal}>¿Olvidaste tu contraseña?</p>
        </form>
      </div>
      <div className={`modal ${modalAbierto ? 'mostrar' : ''}`}>
        <div className="modal-contenido">
          <button className="cerrar" onClick={cerrarModal}>×</button>
          <h3>Recuperar contraseña</h3>
          <form>
            <div className="form-group">
              <p>Ingresa el correo registrado, te mandaremos un correo para que puedas restablecer tu contraseña.</p>
              <label htmlFor="correo">Correo electrónico:</label>
              <input
                type="email"
                id="correo"
                name="correo"
                placeholder="Correo electrónico"
                required
                className='login-inputs-bonitos'
              />
            </div>
            <button type="submit">Enviar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
