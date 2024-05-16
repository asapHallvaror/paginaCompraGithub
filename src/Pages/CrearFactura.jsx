import React, { useState, useEffect } from 'react';
import PaginaCrearFactura from '../Components/PaginaLogin/PaginaCrearFactura/PaginaCrearFactura';
import './CSS/CrearFactura.css'
const CrearFactura = () => {
    const [productos, setProductos] = useState([{ nombre: '', cantidad: 0, precio: 0, total: 0 }]);
    const [subtotal, setSubtotal] = useState(0);
    const [iva, setIVA] = useState(0);
    const [totalGeneral, setTotalGeneral] = useState(0);

    const agregarProducto = () => {
        setProductos([...productos, { nombre: '', cantidad: 0, precio: 0, total: 0 }]);
    };

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const newProductos = [...productos];
        newProductos[index][name] = value;
        if (name === 'cantidad' || name === 'precio') {
            newProductos[index].total = parseFloat(newProductos[index].cantidad) * parseFloat(newProductos[index].precio);
        }
        setProductos(newProductos);
    };

    useEffect(() => {
        calcularSubtotal();
    }, [productos]); // Ejecutar cuando se actualice el estado de productos

    useEffect(() => {
        calcularIVA();
        calcularTotalGeneral();
    }, [subtotal]); // Ejecutar cuando se actualice el subtotal

    const calcularSubtotal = () => {
        let total = 0;
        productos.forEach(producto => {
            total += parseFloat(producto.total);
        });
        setSubtotal(total);
    };

    const calcularIVA = () => {
        const ivaValor = subtotal * 0.19;
        setIVA(ivaValor);
    };

    const calcularTotalGeneral = () => {
        const total = subtotal + iva;
        setTotalGeneral(total);
    };

    const handleSubmit = event => {
        event.preventDefault();
        // Aquí puedes manejar el envío del formulario
        console.log('Formulario enviado:', productos);
    };

    return (
        <div className='container'>
            <PaginaCrearFactura />
            <div className="form-container">
                <h2>Orden de Compra</h2>
                <form onSubmit={handleSubmit}>
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre del Producto</th>
                                <th>Cantidad</th>
                                <th>Precio Unitario</th>
                                <th>Total por Producto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((producto, index) => (
                                <tr key={index}>
                                    <td><input type="text" name="nombre" value={producto.nombre} onChange={e => handleInputChange(index, e)} required /></td>
                                    <td><input type="number" name="cantidad" value={producto.cantidad} onChange={e => handleInputChange(index, e)} min="1" required /></td>
                                    <td><input type="number" name="precio" value={producto.precio} onChange={e => handleInputChange(index, e)} min="0.01" step="0.01" required /></td>
                                    <td><input type="text" value={producto.total} readOnly /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button type="button" onClick={agregarProducto}>Agregar Producto</button>
                    <br /><br />
                    <label>Subtotal:</label>
                    <p>{Math.round(subtotal)}</p>
                    <br />
                    <label>IVA (19%):</label>
                    <p>{Math.round(iva)}</p>
                    <br />
                    <label>Total General (IVA incluido):</label>
                    <p>{Math.round(totalGeneral)}</p>
                    <br /><br />
                    <button type="submit">Generar Factura</button>
                </form>
            </div>
        </div>
    );
}

export default CrearFactura;
