import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import Swal from 'sweetalert2';


const HomePage = () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const auth = useAuth();
    const [facturas, setFacturas] = useState([]);
    const [filtroFactura, setFiltroFactura] = useState('todas'); // Estado de filtro por estado de factura
    const [filtroEntrega, setFiltroEntrega] = useState('todas'); // Estado de filtro por estado de entrega

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
    };

    const fechaCapitalized = fecha.split(' ').map(capitalizeFirstLetter).join(' ');

    const filtrarFacturas = (estado, tipo) => {
        if (tipo === 'factura') {
            setFiltroFactura(estado);
        } else if (tipo === 'entrega') {
            setFiltroEntrega(estado);
        }
    };

    const contarFacturasPorEstado = (estado) => {
        return facturas.filter(factura => factura.estado_factura === estado).length;
    };

    const contarFacturasPorEstadoEntrega = (estado) => {
        return facturas.filter(factura => factura.estado_entrega === estado).length;
    };

    const facturasFiltradas = facturas.filter(factura => {
        const filtroFacturaPass = filtroFactura === 'todas' || factura.estado_factura === filtroFactura;
        const filtroEntregaPass = filtroEntrega === 'todas' || factura.estado_entrega === filtroEntrega;
        return filtroFacturaPass && filtroEntregaPass;
    });

    const eliminarFactura = async (numero_orden) => {
    const confirm = await Swal.fire({
        title: `¿Eliminar Factura N°${numero_orden}?`,
        text: 'Esta acción marcará la factura como eliminada',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (!confirm.isConfirmed) return;

    try {
        const response = await fetch(`http://localhost:3001/api/factura/eliminar/${numero_orden}`, {
        method: 'DELETE'
        });

        const result = await response.json();
        if (result.success) {
        await Swal.fire({
            title: 'Eliminada',
            text: 'La factura fue eliminada correctamente',
            icon: 'success'
        });
        setFacturas(prev => prev.filter(f => f.numero_orden !== numero_orden));
        } else {
        await Swal.fire({
            title: 'Error',
            text: result.message || 'No se pudo eliminar la factura',
            icon: 'error'
        });
        }
    } catch (err) {
        console.error('Error eliminando factura:', err.message);
        await Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error inesperado',
        icon: 'error'
        });
    }
    };


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
                        <p style={{ marginTop: '12px', marginRight: '20px' }}>Filtrar por estado de factura:</p>
                        <button className={filtroFactura === 'todas' ? 'activo' : ''} onClick={() => filtrarFacturas('todas', 'factura')}>Todas ({facturas.length})</button>
                        <button className={filtroFactura === 'creada' ? 'activo' : ''} onClick={() => filtrarFacturas('creada', 'factura')}>Creadas ({contarFacturasPorEstado('creada')})</button>
                        <button className={filtroFactura === 'rectificada' ? 'activo' : ''} onClick={() => filtrarFacturas('rectificada', 'factura')}>Rectificadas ({contarFacturasPorEstado('rectificada')})</button>
                        <button className={filtroFactura === 'anulada' ? 'activo' : ''} onClick={() => filtrarFacturas('anulada', 'factura')}>Anuladas ({contarFacturasPorEstado('anulada')})</button>
                    </div>

                    <div className="filtro-container">
                        <p style={{ marginTop: '12px', marginRight: '20px' }}>Filtrar por estado de entrega:</p>
                        <button className={filtroEntrega === 'todas' ? 'activo' : ''} onClick={() => filtrarFacturas('todas', 'entrega')}>Todas ({facturas.length})</button>
                        <button className={filtroEntrega === 'por entregar' ? 'activo' : ''} onClick={() => filtrarFacturas('por entregar', 'entrega')}>Por Entregar ({contarFacturasPorEstadoEntrega('por entregar')})</button>
                        <button className={filtroEntrega === 'rechazada' ? 'activo' : ''} onClick={() => filtrarFacturas('rechazada', 'entrega')}>Rechazadas ({contarFacturasPorEstadoEntrega('rechazada')})</button>
                        <button className={filtroEntrega === 'entregada' ? 'activo' : ''} onClick={() => filtrarFacturas('entregada', 'entrega')}>Entregadas ({contarFacturasPorEstadoEntrega('entregada')})</button>
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
                                    <th>Eliminar factura</th>
                                </tr>
                            </thead>
                            <tbody>
                                {facturasFiltradas.map(factura => {
                                    const fechaOrden = new Date(factura.fecha_orden);
                                    const fechaOrdenChilena = fechaOrden.toLocaleDateString('es-CL');

                                    let estadoColor;
                                    let estadoFacturaTextColor;
                                    if (factura.estado_factura === 'creada') {
                                        estadoColor = 'yellow';
                                    } else if (factura.estado_factura === 'rectificada') {
                                        estadoColor = 'orange';
                                    } else if (factura.estado_factura === 'anulada') {
                                        estadoColor = 'red';
                                        estadoFacturaTextColor = 'white';
                                    } else {
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
                                    } else if (factura.estado_entrega === 'N/A') {
                                        estadoEntregaColor = 'red';
                                        estadoEntregaTextColor = 'white';
                                    } else {
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
                                                    <button style={{ marginLeft: '40px', borderRadius: '5px', cursor: 'pointer' }}>Ver detalle</button>
                                                </Link>
                                            </td>
                                            <td>
                                                <p style={{ backgroundColor: estadoColor, color: estadoFacturaTextColor, borderRadius: '100px', textAlign: 'center' }}>{factura.estado_factura}</p>
                                            </td>
                                            <td>
                                                {factura.estado_factura === 'anulada' ? (
                                                    <p style={{ fontSize: '15px', textAlign: 'center' }}>N/A</p>
                                                ) : (
                                                    <p style={{ backgroundColor: estadoEntregaColor, color: estadoEntregaTextColor, borderRadius: '100px', textAlign: 'center' }}>
                                                        {factura.estado_entrega}
                                                    </p>
                                                )}

                                            </td>
                                            <td>
                                                {factura.estado_entrega === 'entregada' || factura.estado_factura === 'anulada' ? (
                                                    <p style={{ fontSize: '15px', textAlign: 'center' }}>No se puede cambiar estado</p>
                                                ) : (
                                                    <Link to={`/cambiarestado/${factura.numero_orden}`}>
                                                        <button style={{ marginLeft: '50px', borderRadius: '5px', cursor: 'pointer'  }}>Cambiar estado</button>
                                                    </Link>
                                                )}
                                            </td>
                                            <td>
                                                <Link to={`/historialcambios/${factura.numero_orden}`} className="ver-historial">
                                                    <button style={{ marginLeft: '50px' }}>Ver historial</button>
                                                </Link>
                                            </td>
                                            <td>
                                                {factura.estado_factura === 'creada' ? (
                                                    <button
                                                    className="btn-eliminar"
                                                    onClick={() => eliminarFactura(factura.numero_orden)}
                                                    >
                                                    Eliminar
                                                    </button>
                                                ) : (
                                                    <p style={{ fontSize: '14px' }}>No disponible</p>
                                                )}
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
};

export default HomePage;
