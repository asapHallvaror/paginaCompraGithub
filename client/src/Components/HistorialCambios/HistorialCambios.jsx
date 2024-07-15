import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './HistorialCambios.css';

const HistorialCambios = () => {
  const { id } = useParams();
  const [historialCambios, setHistorialCambios] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/factura/historial/${id}`);
        setHistorialCambios(response.data);
      } catch (error) {
        console.error('Error al obtener el historial de cambios:', error.message, error.response?.data);
      }
    };

    if (id) {
      fetchHistorial();
    }
  }, [id]);

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className='historial-container'> 
      <h1 style={{textAlign: 'center'}}>Historial de Cambios de Factura N° {id}</h1>
      {historialCambios.length === 0 ? (
                <p style={{textAlign: 'center'}}>No hay ningún cambio hasta ahora</p>
      ) : (
      <ul>
        {historialCambios.map((cambio, index) => (
          <li key={index}>
            <p style={{textAlign: 'center'}}>Fecha y hora de cambio: {
              new Date(cambio.fecha_cambio).toLocaleString('es-CL', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                hour12: false
              })
            }</p>
            <p style={{textAlign: 'center', marginBottom: '50px'}}>Estado Nuevo: {cambio.estado_nuevo}</p>
            <hr />
          </li>
        ))}
      </ul>
      )}
      <div className="btn-volver-hist-container">
        <button className='btn-volver-hist' onClick={handleCancel}>
                      <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path></svg>
                      <span>Volver</span>
        </button>
      </div>
    </div>
  );
};

export default HistorialCambios;
