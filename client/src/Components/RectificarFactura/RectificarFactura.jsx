import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './RectificarFactura.css';
import Swal from 'sweetalert2';


const EditarFactura = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [factura, setFactura] = useState(null);
    const [initialFactura, setInitialFactura] = useState(null);


    useEffect(() => {
        const fetchFactura = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/factura/${id}`);
                const facturaData = response.data;
                facturaData.productos = JSON.parse(facturaData.productos); // Parse correctamente la propiedad productos
                facturaData.productos.forEach(producto => {
                    producto.total = producto.precio * producto.cantidad; // Calcular el total por producto
                });
                setFactura(facturaData);
                setInitialFactura(facturaData); // Guardar estado inicial

            } catch (error) {
                console.error('Error al obtener los detalles de la factura:', error.message, error.response?.data);
            }
        };
        fetchFactura();
    }, [id]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFactura({ ...factura, [name]: value });
    };

    const handleProductChange = (index, event) => {
        const { name, value } = event.target;
        const productos = [...factura.productos];
        productos[index] = { ...productos[index], [name]: value };
        productos[index].total = productos[index].precio * productos[index].cantidad; // Recalcular el total del producto
        setFactura({ ...factura, productos });
    };

    const handleProductAdd = () => {
        const nuevoProducto = { nombre: '', precio: 0, cantidad: 1, total: 0 };
        setFactura({ ...factura, productos: [...factura.productos, nuevoProducto] });
    };

    const handleProductDelete = (index) => {
        if (factura.productos.length > 1) {
            const productos = factura.productos.filter((_, i) => i !== index);
            setFactura({ ...factura, productos });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'No puedes eliminar el único producto que está en la factura!',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }
    };

    const formatDateForMySQL = (dateString) => {
        const date = new Date(dateString);
        let month = '' + (date.getMonth() + 1),
            day = '' + date.getDate(),
            year = date.getFullYear();
      
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
      
        return [year, month, day].join('-');
    };

    const calcularSubtotal = () => {
        if (!factura || !factura.productos) return 0;
        return Math.round(factura.productos.reduce((total, producto) => total + producto.total, 0));
    };

    const calcularIva = (subtotal) => {
        const iva = Math.round(subtotal * 0.19); // IVA del 19%
        return iva;
    };

    const calcularTotal = (subtotal, iva) => {
        const total = Math.round(subtotal + iva);
        return total;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (JSON.stringify(factura) === JSON.stringify(initialFactura)) {
            Swal.fire({
                title: 'Sin cambios',
                text: 'Por qué presionaste el botón si no has realizado modificaciones? -_-',
                icon: 'info',
                confirmButtonText: 'OK'
            });
            return;
        }
    
        // Mostrar alerta de confirmación
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Realmente quieres confirmar las modificaciones?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar'
        });
    
        if (result.isConfirmed) {
            try {
                // Agrupar productos por nombre y sumar cantidades y totales si son iguales
                const productosAgrupados = factura.productos.reduce((acc, producto) => {
                    if (acc[producto.nombre]) {
                        acc[producto.nombre].cantidad += parseFloat(producto.cantidad);
                        acc[producto.nombre].total += producto.precio * producto.cantidad;
                    } else {
                        acc[producto.nombre] = {
                            ...producto,
                            cantidad: parseFloat(producto.cantidad),
                            total: producto.precio * producto.cantidad
                        };
                    }
                    return acc;
                }, {});
        
                // Convertir el objeto agrupado de nuevo a un array y ajustar los tipos de datos
                const productosFormateados = Object.values(productosAgrupados).map(producto => ({
                    ...producto,
                    precio: producto.precio.toString(),
                    cantidad: producto.cantidad.toString(),
                    total: producto.total.toString()
                }));
        
                // Convertir los productos formateados a JSON sin las barras invertidas
                const productosJson = JSON.stringify(productosFormateados);
        
                // Calcular subtotal, IVA y total
                const subtotal = calcularSubtotal();
                const iva = calcularIva(subtotal);
                const total = calcularTotal(subtotal, iva);
    
                // Crear el objeto de factura actualizada para enviar al servidor
                const updatedFactura = { 
                    ...factura, 
                    productos: productosJson,
                    fecha_orden: formatDateForMySQL(factura.fecha_orden),
                    fechaDespacho: formatDateForMySQL(factura.fechaDespacho),
                    subtotal: subtotal,
                    iva: iva,
                    total: total
                };
        
                // Actualizar la factura en la base de datos
                await axios.put(`http://localhost:3001/api/factura/${id}`, updatedFactura);
        
                // Cambiar el estado de la factura a "rectificada"
                const updatedFacturaWithEstado = { ...updatedFactura, estado_factura: 'rectificada' };
                await axios.put(`http://localhost:3001/api/factura/${id}`, updatedFacturaWithEstado);
        
                // Mostrar alerta de éxito
                await Swal.fire({
                    title: 'Éxito',
                    text: 'La factura ha sido actualizada correctamente.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
    
                navigate('/home');
            } catch (error) {
                console.error('Error al actualizar la factura:', error.message, error.response?.data);
            }
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        let month = '' + (date.getMonth() + 1),
            day = '' + date.getDate(),
            year = date.getFullYear();
      
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
      
        return [year, month, day].join('-');
    };

    if (!factura) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <h1 className='h1corte'>Rectificar Factura N° {factura.numero_orden}</h1>
            <p className='pcorte'>En esta página puedes modificar los datos que requieras de la factura!</p>
            <form onSubmit={handleSubmit} className='formulario-factura'>
                <table className="factura-table">
                    <tbody>
                        <tr>
                            <td><label>Número de Factura:</label></td>
                            <td><input type="text" name="numero_orden" value={factura.numero_orden} onChange={handleInputChange} disabled/></td>
                            <td><label>Fecha de Factura:</label></td>
                            <td><input type="date" name="fecha_orden" value={formatDate(factura.fecha_orden)} onChange={handleInputChange} /></td>
                            <td><label>Estado de la factura:</label></td>
                            <td><input type="text" name="estado_factura" value={factura.estado_factura} onChange={handleInputChange} disabled/></td>
                        </tr>
                    </tbody>
                </table>
                <h2 className='h1corte'>Datos proveedor</h2>
                <table className='factura-table'>
                    <tbody>
                        <tr>
                            <td><label>Rut:</label></td>
                            <td><input type="text" name="rut_proveedor" value={factura.rut_proveedor} onChange={handleInputChange}  required minLength='9' maxLength='10'/></td>
                            <td><label>Razón social:</label></td>
                            <td><input type="text" name="razon_social_proveedor" value={factura.razon_social_proveedor} onChange={handleInputChange} required minLength="5" maxLength="45"/></td>
                            <td><label>Dirección:</label></td>
                            <td><input type="text" name="direccion_proveedor" value={factura.direccion_proveedor} onChange={handleInputChange} required minLength="5" maxLength="45"/></td>
                        </tr>
                        <tr>
                            <td><label>Teléfono:</label></td>
                            <td><input type="number" name="telefono_proveedor" value={factura.telefono_proveedor} onChange={handleInputChange} required/></td>
                            <td><label>Correo:</label></td>
                            <td><input type="text" name="correo_proveedor" value={factura.correo_proveedor} onChange={handleInputChange} required/></td>
                            <td><label>Sitio Web:</label></td>
                            <td><input type="text" name="sitio_web_proveedor" value={factura.sitio_web_proveedor} onChange={handleInputChange}/></td>
                        </tr>
                        <tr>
                            <td><label>Tipo Servicio:</label></td>
                            <td><input type="text" name="tipo_servicio" value={factura.tipo_servicio} onChange={handleInputChange} /></td>
                        </tr>
                    </tbody>
                </table>
                <h2 className='h1corte'>Datos cliente</h2>
                <table className="factura-table">
                    <tbody>
                        <tr>
                            <td><label>Rut:</label></td>
                            <td><input type="text" name="rut_cliente" value={factura.rut_cliente} onChange={handleInputChange} required minLength='9' maxLength='10'/></td>
                            <td><label>Nombre/Razón social:</label></td>
                            <td><input type="text" name="nombre_cliente" value={factura.nombre_cliente} onChange={handleInputChange} required minLength="3" maxLength="45"/></td>
                            <td><label>Dirección:</label></td>
                            <td><input type="text" name="direccion_cliente" value={factura.direccion_cliente} onChange={handleInputChange} required minLength="3" maxLength="80"/></td>
                        </tr>
                        <tr>
                            <td><label>Teléfono:</label></td>
                            <td><input type="text" name="telefono_cliente" value={factura.telefono_cliente} onChange={handleInputChange} required /></td>
                            <td><label>Correo:</label></td>
                            <td><input type="text" name="correo_cliente" value={factura.correo_cliente} onChange={handleInputChange} required/></td>
                        </tr>
                    </tbody>
                </table>

                <h2 className='h1corte'>Productos</h2>
                <table className="productos-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Precio Unitario</th>
                            <th>Cantidad</th>
                            <th>Total</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {factura.productos.map((producto, index) => (
                            <tr key={index}>
                                <td><input type="text" name="nombre" value={producto.nombre} onChange={(event) => handleProductChange(index, event)} /></td>
                                <td><input type="number" name="precio" value={producto.precio} onChange={(event) => handleProductChange(index, event)} /></td>
                                <td><input type="number" name="cantidad" value={producto.cantidad} onChange={(event) => handleProductChange(index, event)} /></td>
                                <td><input type="number" name="total" value={Math.round(producto.total)} disabled /></td>
                                <td><button type="button" onClick={() => handleProductDelete(index)}>Eliminar Producto</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button type="button" onClick={handleProductAdd}>Agregar Producto</button>

                <h2 className='h1corte'>Datos de despacho</h2>
                <table className="factura-table">
                    <tbody>
                        <tr>
                            <td><label>Región:</label></td>
                            <td><input type="text" name="regionDespacho" value={factura.regionDespacho} onChange={handleInputChange} /></td>
                            <td><label>Comuna:</label></td>
                            <td><input type="text" name="comunaDespacho" value={factura.comunaDespacho} onChange={handleInputChange} /></td>
                            <td><label>Dirección</label></td>
                            <td><input type="text" name="direccionDespacho" value={factura.direccionDespacho} onChange={handleInputChange} /></td>
                        </tr>
                        <tr>
                            <td><label>Fecha estimada de entrega:</label></td>
                            <td><input type="date" name="fechaDespacho" value={formatDate(factura.fechaDespacho)} onChange={handleInputChange} /></td>
                        </tr>
                    </tbody>
                </table>

                <h2 className='h1corte'>Valores finales</h2>
                <table className="factura-table">
                    <tbody>
                        <tr>
                            <td><label>Subtotal</label></td>
                            <td><input type="number" name='subtotal' value={Math.round(calcularSubtotal())} onChange={handleInputChange} disabled/></td>
                            <td><label>Iva</label></td>
                            <td><input type="number" name='iva' value={Math.round(calcularIva(calcularSubtotal()))} onChange={handleInputChange} disabled/></td>
                            <td><label>Total</label></td>
                            <td><input type="number" name='total' value={Math.round(calcularTotal(calcularSubtotal(), calcularIva(calcularSubtotal())))} onChange={handleInputChange} disabled/></td>
                        </tr>
                    </tbody>
                </table>

                <div className="botones-container">
                    <button type="submit">Confirmar Cambios</button>
                    <button type="button" onClick={handleCancel}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default EditarFactura;
