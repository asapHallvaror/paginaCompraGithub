import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext'

const HomePage = () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const auth = useAuth();
    const [facturas, setFacturas] = useState([]);
    const [filtro, setFiltro] = useState('todas');

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
          window.location.href = '/'; // Redirige a la página de inicio
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

    const filtrarFacturas = (estado) => {
        setFiltro(estado);
    };

    const facturasFiltradas = filtro === 'todas' ? facturas : facturas.filter(factura => factura.estado_factura === filtro);

    return (
        <div>
            <div className="home-container">
                <button onClick={handleLogout} className="btn-logout">
                    <div className="sign">
                        <svg viewBox="0 0 512 512">
                            <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                        </svg>
                    </div>
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
                    <div className="filtro-container">
                        <button onClick={() => filtrarFacturas('todas')}>Todas</button>
                        <button onClick={() => filtrarFacturas('creada')}>Creadas</button>
                        <button onClick={() => filtrarFacturas('rectificada')}>Rectificadas</button>
                        <button onClick={() => filtrarFacturas('anulada')}>Anuladas</button>
                    </div>
                    {facturasFiltradas.length === 0 ? (
                        <p style={{ fontSize: '20px', textAlign: 'center' }}>No hay facturas para mostrar con el estado que escogiste</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Número de orden</th>
                                    <th>Fecha factura</th>
                                    <th>Ver detalle factura</th>
                                    <th>Estado factura</th>
                                    <th>Estado despacho</th>
                                    <th>Cambiar estado de despacho</th>
                                    <th>Ver historial de cambios</th>
                                </tr>
                            </thead>
                            <tbody>
                                {facturasFiltradas.map(factura => {
                                    const fechaOrden = new Date(factura.fecha_orden);
                                    const fechaOrdenChilena = fechaOrden.toLocaleDateString('es-CL');
                                    
                                    let estadoColor;
                                    let estadoFacturaTextColor
                                    if (factura.estado_factura === 'creada') {
                                        estadoColor = 'yellow';
                                    } else if (factura.estado_factura === 'rectificada') {
                                        estadoColor = 'orange';
                                    } else if (factura.estado_factura === 'anulada') {
                                        estadoColor = 'red';
                                        estadoFacturaTextColor = 'white';
                                    }
                                     else {
                                        estadoColor = 'transparent'; // Color por defecto si no coincide con los estados especificados
                                    }
                                    

                                    let estadoEntregaColor;
                                    let estadoEntregaTextColor = 'black'; // Color de texto por defecto
                                    if (factura.estado_entrega === 'por entregar') {
                                        estadoEntregaColor = 'purple';
                                        estadoEntregaTextColor = 'white';
                                    } else if (factura.estado_entrega === 'rechazada') {
                                        estadoEntregaColor = 'red';
                                        estadoEntregaTextColor = 'white';
                                    } else if (factura.estado_entrega === 'entregada') {
                                        estadoEntregaColor = 'green';
                                        estadoEntregaTextColor = 'white';
                                    } else if (factura.estado_entrega === 'N/A'){
                                        estadoEntregaColor = 'red';
                                        estadoEntregaTextColor = 'white';
                                    }
                                    else {
                                        estadoEntregaColor = 'transparent'; // Color por defecto si no coincide con los estados especificados
                                    }

                                    return (
                                        <tr key={factura.numero_orden}>
                                            <td>
                                                <p>{factura.numero_orden}</p>
                                            </td>
                                            <td>
                                                {fechaOrdenChilena}
                                            </td>
                                            <td>
                                                <Link to={`/detalle/${factura.numero_orden}`}>
                                                    <button style={{marginLeft: '40px'}}>Ver detalle</button>
                                                </Link>
                                            </td>
                                            <td>
                                            <p style={{ backgroundColor: estadoColor, color: estadoFacturaTextColor ,borderRadius: '100px', textAlign: 'center' }}>{factura.estado_factura}</p>
                                            </td>
                                            <td>
                                                {factura.estado_factura === 'anulada' ? (
                                                    <p style={{fontSize: '15px', textAlign: 'center'}}>N/A</p>
                                                ) : (
                                                    <p style={{ backgroundColor: estadoEntregaColor, color: estadoEntregaTextColor, borderRadius: '100px', textAlign: 'center' }}>
                                                    {factura.estado_entrega}
                                                    </p>
                                                )}
                                                
                                            </td>
                                            <td>
                                            {factura.estado_entrega === 'entregada' || factura.estado_factura === 'anulada' ? (
                                                <p style={{fontSize: '15px', textAlign: 'center'}}>No se puede cambiar estado</p>
                                            ) : (
                                                <Link to={`/cambiarestado/${factura.numero_orden}`}>
                                                    <button style={{marginLeft: '50px'}}>Cambiar estado</button>
                                                </Link>
                                            )}
                                            </td>
                                            <td>
                                                <Link to={`/historialcambios/${factura.numero_orden}`} className="ver-historial">
                                                    <button style={{marginLeft: '50px'}}>Ver historial</button>
                                                </Link>	
                                            </td>
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
