import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './PaginaDetalleFactura.css';

const PaginaDetFac = () => {
    const { id } = useParams();  // Use "id" to match the route parameter
    const [factura, setFactura] = useState(null);

    useEffect(() => {
        if (id) {  // Ensure that id is defined
            const fetchFactura = async () => {
                try {
                    const response = await axios.get(`http://localhost:3001/api/factura/${id}`);
                    setFactura(response.data); // Directly get the factura object
                } catch (error) {
                    console.error('Error al obtener los detalles de la factura:', error.message, error.response?.data);
                }
            };

            fetchFactura();
        }
    }, [id]);

    if (!factura) {
        return <div>Cargando...</div>;
    }

    // Convertir la cadena JSON de productos a un objeto JavaScript
    const productos = JSON.parse(factura.productos);

    // Darle formato bonito a la fecha
    const fecha = new Date(factura.fecha_orden);
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);

    // Darle formato bonito a la fecha de estimada de despacho
    const fechaDespacho = new Date(factura.fechaDespacho);
    const opcionesDos = { year: 'numeric', month: 'long', day: 'numeric' };
    const fechaEstFormateada = fechaDespacho.toLocaleDateString('es-ES', opcionesDos);


    return (
        <div className='detalle-container'>
            <Link to='/home' >
                <button className='btn-volver'>
                    <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path></svg>
                    <span>Volver</span>
                </button>
            </Link>
            <h1>Detalles de la Factura N° {factura.numero_orden}</h1>
            <table>
                <tbody>
                    <tr>
                        <th>Número de Factura:</th>
                        <td>{factura.numero_orden}</td>
                    </tr>
                    <tr>
                        <th>Fecha de Factura:</th>
                        <td>{fechaFormateada}</td>
                    </tr>
                    <tr>
                        <th>Estado de la factura:</th>
                        <td>{factura.estado_factura}</td>
                    </tr>
                </tbody>
            </table>
            <h2>Datos del proveedor</h2>
            <table>
                <tbody>
                    <tr>
                        <th>Rut:</th>
                        <td>{factura.rut_proveedor}</td>
                    </tr>
                    <tr>
                        <th>Razón social:</th>
                        <td>{factura.razon_social_proveedor}</td>
                    </tr>
                    <tr>
                        <th>Dirección:</th>
                        <td>{factura.direccion_proveedor}</td>
                    </tr>
                    <tr>
                        <th>Teléfono:</th>
                        <td>+56{factura.telefono_proveedor}</td>
                    </tr>
                    <tr>
                        <th>Correo:</th>
                        <td>{factura.correo_proveedor}</td>
                    </tr>
                    <tr>
                        <th>Sitio web:</th>
                        <td>{factura.sitio_web_proveedor}</td>
                    </tr>
                    <tr>
                        <th>Tipo de servicio:</th>
                        <td>{factura.tipo_servicio}</td>
                    </tr>
                </tbody>
            </table>
            <h2>Datos del cliente</h2>
            <table>
                <tbody>
                    <tr>
                        <th>Rut:</th>
                        <td>{factura.rut_cliente}</td>
                    </tr>
                    <tr>
                        <th>Nombre/Razón social:</th>
                        <td>{factura.nombre_cliente}</td>
                    </tr>
                    <tr>
                        <th>Dirección:</th>
                        <td>{factura.direccion_cliente}</td>
                    </tr>
                    <tr>
                        <th>Teléfono:</th>
                        <td>{factura.telefono_cliente}</td>
                    </tr>
                    <tr>
                        <th>Correo:</th>
                        <td>{factura.correo_cliente}</td>
                    </tr>
                </tbody>
            </table>
            <h2>Productos de la factura</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Precio Unitario</th>
                        <th>Cantidad</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((producto, index) => (
                        <tr key={index}>
                            <td>{producto.nombre}</td>
                            <td>{Number(producto.precio).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</td>
                            <td>{producto.cantidad}</td>
                            <td>{Number(producto.total).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h2>Detalles del despacho</h2>
            <table>
                <tbody>
                    <tr>
                        <th>Región:</th>
                        <td>{factura.regionDespacho}</td>    
                    </tr>
                    <tr>
                        <th>Comuna:</th>
                        <td>{factura.comunaDespacho}</td>
                    </tr>
                    <tr>
                        <th>Dirección:</th>
                        <td>{factura.direccionDespacho}</td>
                    </tr>
                    <tr>
                        <th>Fecha estimada de entrega:</th>
                        <td>{fechaEstFormateada}</td>
                    </tr>
                    <tr>
                        <th>Estado del despacho:</th>
                        <td>{factura.estado_entrega}</td>
                    </tr>
                </tbody>
            </table>

            <h2>Montos</h2>
            <table>
                <tbody>
                    <tr>
                        <th>Subtotal:</th>
                        <td>{Number(factura.subtotal).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</td>
                    </tr>
                    <tr>
                        <th>IVA:</th>
                        <td>{Number(factura.iva).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</td>
                    </tr>
                    <tr>
                        <th>Total General:</th>
                        <td>{Number(factura.total).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</td>
                    </tr>
                </tbody>
            </table>
            <Link to={`/rectificar/${id}`}>
                <button className='btn-rectificar'>
                    Hacer rectificaciones
                </button>
            </Link>
            
        </div>
    );
};

export default PaginaDetFac;