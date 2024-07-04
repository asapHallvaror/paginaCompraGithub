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
    const [nombreArchivo, setNombreArchivo] = useState('Haz click para agregar la evidencia');



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
        setNombreArchivo(file ? file.name : 'Haz click para agregar la evidencia');
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
            <Link to='/home'>
                <button className='btn-volver'>
                    <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path></svg>
                    <span>Volver</span>
                </button>
            </Link>
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
                                    <input style={{ marginLeft: '20px' }} type="text" value={direccionEntrega} onChange={handleDireccionEntregaChange} />
                                </label>
                                <label className='tituloCam'>
                                    Rut de Persona que Recibe:
                                    <input style={{ marginLeft: '20px' }} type="text" value={rutPersonaRecibe} onChange={handleRutPersonaRecibeChange} />
                                </label>
                                <label className='tituloCam'>
                                    Evidencia de Entrega:
                                    <label class="custum-file-upload" for="file">
                                    <div class="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 24 24"><g stroke-width="0" id="SVGRepo_bgCarrier"></g><g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <path fill="" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z" clip-rule="evenodd" fill-rule="evenodd"></path> </g></svg>
                                    </div>
                                    <div class="text">
                                    <span>{nombreArchivo}</span>
                                    </div>
                                    <input type="file" id="file" onChange={handleEvidenciaEntregaChange}/>
                                    
                                    </label>

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