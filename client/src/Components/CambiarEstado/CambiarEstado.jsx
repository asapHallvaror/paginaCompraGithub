import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './CambiarEstado.css';

const CambiarEstado = () => {
    const { id } = useParams();
    const [factura, setFactura] = useState(null);
    const [estadoEntrega, setEstadoEntrega] = useState('');
    const [motivoRechazo, setMotivoRechazo] = useState('');
    const [direccionEntrega, setDireccionEntrega] = useState('');
    const [rutPersonaRecibe, setRutPersonaRecibe] = useState('');
    const [evidenciaEntrega, setEvidenciaEntrega] = useState(null);

    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFactura = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/factura/${id}`);
                const facturaData = response.data;

                // Parsea la propiedad productos si es una cadena JSON
                if (typeof facturaData.productos === 'string') {
                    facturaData.productos = JSON.parse(facturaData.productos);
                }

                setFactura(facturaData);
                setEstadoEntrega(facturaData.estado_factura || ''); // Establece el estado de entrega inicial
            } catch (error) {
                console.error('Error al obtener los detalles de la factura:', error.message, error.response?.data);
            }
        };

        if (id) {
            fetchFactura();
        }
    }, [id]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        let month = '' + (date.getMonth() + 1),
            day = '' + date.getDate(),
            year = date.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    };

    const handleEstadoEntregaChange = (e) => {
        const selectedEstadoEntrega = e.target.value;
        setEstadoEntrega(selectedEstadoEntrega);

        // Reiniciar campos dependientes del estado de entrega
        if (selectedEstadoEntrega !== 'entregada') {
            setDireccionEntrega('');
            setRutPersonaRecibe('');
            setEvidenciaEntrega(null);
        }
    };

    const handleMotivoRechazoChange = (e) => {
        setMotivoRechazo(e.target.value);
    };

    const handleDireccionEntregaChange = (e) => {
        setDireccionEntrega(e.target.value);
    };

    const handleRutPersonaRecibeChange = (e) => {
        setRutPersonaRecibe(e.target.value);
    };

    const handleEvidenciaEntregaChange = (e) => {
        const file = e.target.files[0];
        setEvidenciaEntrega(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('estado_entrega', estadoEntrega);
            formData.append('motivo_rechazo', motivoRechazo);
            formData.append('direccion_entrega', direccionEntrega);
            formData.append('rut_receptor', rutPersonaRecibe);
            if (evidenciaEntrega) {
                formData.append('foto_evidencia', evidenciaEntrega);
            }

            const response = await axios.put(`http://localhost:3001/api/factura/estado/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Estado de entrega actualizado:', response.data);
            setMensaje('Estado de entrega actualizado correctamente');
            setError('');
        } catch (error) {
            console.error('Error al actualizar el estado de entrega:', error.message, error.response?.data);
            setError('Error al actualizar el estado de entrega');
            setMensaje('');
        }
    };

    return (
        <div>
            <h1 className='tituloCam'>Cambiar estado de despacho de la factura N° {factura && factura.numero_orden}</h1>
            {error && <div className="error">{error}</div>}
            {mensaje && <div className="success">{mensaje}</div>}
            {factura ? (
                <div>
                    <table className="factura-table">
                        <tbody>
                            <tr>
                                <td><label>Número de Factura:</label></td>
                                <td><input type="text" name="numero_orden" value={factura.numero_orden} disabled /></td>
                                <td><label>Fecha de Factura:</label></td>
                                <td><input type="date" name="fecha_orden" value={formatDate(factura.fecha_orden)} disabled /></td>
                                <td><label>Estado de la factura:</label></td>
                                <td><input type="text" name="estado_factura" value={factura.estado_factura} disabled /></td>
                            </tr>
                        </tbody>
                    </table>
                    <h2 className='tituloCam'>Detalles actuales del despacho</h2>
                    <table>
                        <tbody>
                            <tr>
                                <td><label>Región</label></td>
                                <td><input type="text" name='regionDespacho' value={factura.regionDespacho} disabled/></td>
                                <td><label>Comuna</label></td>
                                <td><input type="text" name='comunaDespacho' value={factura.comunaDespacho} disabled/></td>
                                <td><label>Dirección</label></td>
                                <td><input type="text" name='direccionDespacho' value={factura.direccionDespacho} disabled/></td>
                            </tr>
                            <tr>
                                <td><label>Fecha estimada de despacho</label></td>
                                <td><input type="text" name='fechaDespacho' value={formatDate(factura.fechaDespacho)} disabled/></td>
                                <td><label>Estado de despacho</label></td>
                                <td><input type="text" name='estado_entrega' value={factura.estado_entrega} disabled/></td>
                            </tr>
                        </tbody>
                    </table>
                    

                    <div className='actualizar-container'>
                        <h2 className='tituloCam'>Actualizar Estado de Entrega</h2>
                        <label className='tituloCam'>
                            Estado de Entrega:
                            <select style={{ marginLeft: '20px' }} value={estadoEntrega} onChange={handleEstadoEntregaChange}>
                                <option value="">Seleccione un estado</option>
                                <option value="por_entregar">Por entregar</option>
                                <option value="entregada">Entregado</option>
                                <option value="rechazada">Rechazado</option>
                            </select>
                        </label>
                        {estadoEntrega === 'rechazada' && (
                            <label className='tituloCam'>
                                Motivo de Rechazo:
                                <textarea style={{ marginLeft: '20px' }} value={motivoRechazo} onChange={handleMotivoRechazoChange}></textarea>
                            </label>
                        )}
                        {estadoEntrega === 'entregada' && (
                            <div>
                                <label className='tituloCam'>
                                    Dirección de Entrega:
                                    <input type="text" value={direccionEntrega} onChange={handleDireccionEntregaChange} />
                                </label>
                                <label className='tituloCam'>
                                    Rut de Persona que Recibe:
                                    <input type="text" value={rutPersonaRecibe} onChange={handleRutPersonaRecibeChange} />
                                </label>
                                <label className='tituloCam'>
                                    Evidencia de Entrega:
                                    <input type="file" onChange={handleEvidenciaEntregaChange} />
                                </label>
                            </div>
                        )}
                        <button className='botoncito' onClick={handleSubmit}>Actualizar Estado</button>
                    </div>

                    {/* Agrega un enlace para ver el historial de cambios */}
                    <Link to={`/historialcambios/${factura.numero_orden}`} className="ver-historial">
                        Ver Historial de Cambios
                    </Link>
                </div>
            ) : (
                <div>Cargando...</div>
            )}
        </div>
    );
};

export default CambiarEstado;