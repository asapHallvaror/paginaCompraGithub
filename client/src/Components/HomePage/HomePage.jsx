import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext'

const HomePage = () => {
  
    const userData = JSON.parse(localStorage.getItem('user'));
    const auth = useAuth();
    const [facturas, setFacturas] = useState([]);



    useEffect(() => {
        const obtenerFacturas = async () => {
            const response = await fetch(`http://localhost:3001/facturas?rut_proveedor=${userData.RUT}`);
            const facturas = await response.json();
            setFacturas(facturas);
        };

        obtenerFacturas();
    }, [userData.RUT]);

    const handleLogout = () => {
        auth.signout(() => {
          // Redirige al usuario después de cerrar sesión
          window.location.href = '/'; // Por ejemplo, redirige a la página de inicio
        });
    };

  const fecha = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const fechaCapitalized = fecha.split(' ').map(capitalizeFirstLetter).join(' ');

  return (
    <div>
        <div className="home-container">
        <button onClick={handleLogout} class="btn-logout">
  
            <div class="sign"><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div>

        </button>
            <div className="header-home">
                <h1>Bienvenid@ {userData.RAZON_SOCIAL}</h1>
                <p>{fechaCapitalized}</p>
            </div>
            <div className="middle-container">
                <Link to='/factura'>
                    <button className='Btn'>
                        <span>Crear nueva factura</span>
                    </button>
                </Link>
            </div>

            <div className="bottom-container">
                <h2>Tus facturas</h2>
                {facturas.length === 0 ? (
                    <p style={{fontSize: '20px', textAlign: 'center'}}>No has creado ninguna factura <br />¡Puedes crear una nueva factura en el botón superior!</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Número de orden</th>
                                <th>Fecha factura</th>
                                <th>Ver detalle factura</th>
                            </tr>
                        </thead>
                        <tbody>
                            {facturas.map(factura => {
                                const fechaOrden = new Date(factura.fecha_orden);
                                const fechaOrdenChilena = fechaOrden.toLocaleDateString('es-CL');

                                return (
                                    <tr key={factura.numero_orden}>
                                        <td>
                                            <p>{factura.numero_orden}</p>
                                        </td>
                                        <td>
                                            {fechaOrdenChilena}
                                        </td>
                                        <Link to={`/detalle/${factura.numero_orden}`}>
                                            <td>
                                                <button style={{ marginLeft: '30px' }}>Ver detalle</button>
                                            </td>
                                        </Link>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    </div>
  );
}

export default HomePage;
