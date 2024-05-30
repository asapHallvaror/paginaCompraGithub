// src/PaginaCrearFactura.js

import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './PaginaCrearFactura.css';
import companyData from '../../../CompanyData.js';


const PaginaCrearFactura = () => {
    const [productos, setProductos] = useState([{ nombre: '', cantidad: 0, precio: 0, total: 0 }]);
    const [subtotal, setSubtotal] = useState(0);
    const [iva, setIVA] = useState(0);
    const [totalGeneral, setTotalGeneral] = useState(0);

    const agregarProducto = () => {
        setProductos([...productos, { nombre: '', cantidad: 0, precio: 0, total: 0 }]);
    };

    const eliminarProducto = (index) => {
        const newProductos = productos.filter((_, i) => i !== index);
        setProductos(newProductos);
    };

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const newProductos = [...productos];
        newProductos[index][name] = value;
        if (name === 'cantidad' || name === 'precio') {
            const cantidad = parseFloat(newProductos[index].cantidad) || 0;
            const precio = parseFloat(newProductos[index].precio) || 0;
            newProductos[index].total = cantidad * precio;
        }
        setProductos(newProductos);
    };

    useEffect(() => {
        calcularSubtotal();
    }, [productos]);

    useEffect(() => {
        calcularIVA();
        calcularTotalGeneral();
    }, [subtotal]);

    const calcularSubtotal = () => {
        let total = 0;
        productos.forEach(producto => {
            total += parseFloat(producto.total) || 0;
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
        generarPDF();
    };

    const generarPDF = () => {
        const doc = new jsPDF();

        // Título
        doc.setFontSize(18);
        doc.text('Factura', 14, 22);

        // Información de la empresa
        doc.setFontSize(12);
        doc.text(`Razón Social: ${companyData.nombreEmpresa}`, 14, 30);
        doc.text(`RUT: ${companyData.rutEmpresa}`, 14, 36);
        doc.text(`Dirección: ${companyData.direccion}`, 14, 42);
        doc.text(`Teléfono: ${companyData.telefono}`, 14, 48);
        doc.text(`Comuna: ${companyData.comuna}`, 14, 54);
        doc.text(`Región: ${companyData.region}`, 14, 60);
        doc.text(`Correo: ${companyData.correo}`, 14, 66);

        // Información de la factura
        doc.text('Fecha: ' + new Date().toLocaleDateString(), 14, 72);
        doc.text('Subtotal: $' + Math.round(subtotal), 14, 78);
        doc.text('IVA (19%): $' + Math.round(iva), 14, 84);
        doc.text('Total General: $' + Math.round(totalGeneral), 14, 90);

        // Encabezado de la tabla
        const tableColumn = ["Nombre del Producto", "Cantidad", "Precio Unitario", "Total por Producto"];
        const tableRows = [];

        // Datos de la tabla
        productos.forEach(producto => {
            const precio = parseFloat(producto.precio) || 0;
            const total = parseFloat(producto.total) || 0;
            const productoData = [
                producto.nombre,
                producto.cantidad,
                `$${precio.toFixed(2)}`,
                `$${total.toFixed(2)}`,
            ];
            tableRows.push(productoData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 96,
            theme: 'grid',
        });

        // Guardar el PDF
        doc.save('factura.pdf');
    };

    return (
        <div>
            <h2>Orden de Compra</h2>
            <form onSubmit={handleSubmit}>
                <table>
                    <thead>
                        <tr>
                            <th>Nombre del Producto</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                            <th>Total por Producto</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((producto, index) => (
                            <tr key={index}>
                                <td><input type="text" name="nombre" value={producto.nombre} onChange={e => handleInputChange(index, e)} required /></td>
                                <td><input type="number" name="cantidad" value={producto.cantidad} onChange={e => handleInputChange(index, e)} min="1" required /></td>
                                <td><input type="number" name="precio" value={producto.precio} onChange={e => handleInputChange(index, e)} min="0.01" step="0.01" required /></td>
                                <td><input type="text" value={producto.total} readOnly /></td>
                                <td><button type="button" className="delete-button" onClick={() => eliminarProducto(index)}>Eliminar</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button type="button" className="add-button" onClick={agregarProducto}>Agregar Producto</button>
                <div className="total-container">
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
                    <button type="submit" className="submit-button">Generar Factura</button>
                </div>
            </form>
        </div>
    );
};

export default PaginaCrearFactura;
