import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
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

    // Darle formato bonito a la fecha
    const fecha = new Date(factura.fecha_orden);
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);

    return (
        <div>
            <h1>Detalles de la Factura N° {factura.numero_orden}</h1>
            <p>Número de Factura: {factura.numero_orden}</p>
            <p>Fecha de Factura: {fechaFormateada}</p>
            <h2>Datos del proveedor</h2>
            <p>Rut: {factura.rut_proveedor}</p>
            <p>Razón social: {factura.razon_social_proveedor}</p>
            <p>Dirección: {factura.direccion_proveedor}</p>
            <p>Teléfono: +56{factura.telefono_proveedor}</p>
            <p>Correo: {factura.correo_proveedor}</p>
            <p>Sitio web: {factura.sitio_web_proveedor}</p>
            <p>Tipo de servicio: {factura.tipo_servicio}</p>
            <h2>Datos del cliente</h2>
            <p>Rut: {factura.rut_cliente}</p>
            <p>Nombre/Razón social: {factura.nombre_cliente}</p>
            <p>Dirección: {factura.direccion_cliente}</p>
            <p>Teléfono: {factura.telefono_cliente}</p>
            <p>Correo: {factura.correo_cliente}</p>
            <h2>Montos</h2>
            <p>Subtotal: {factura.subtotal}</p>
            <p>IVA: {factura.iva}</p>
            <p>Total General: {factura.total_general}</p>
            {/* Add more fields as necessary */}
        </div>
    );
};

export default PaginaDetFac;