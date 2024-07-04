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
      <h1>Historial de Cambios de Factura N° {id}</h1>
      <ul>
        {historialCambios.map((cambio, index) => (
          <li key={index}>
            <p>Fecha y hora de cambio: {
              new Date(cambio.fecha_cambio).toLocaleString('es-CL', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                hour12: false
              })
            }</p>
            <p>Estado Nuevo: {cambio.estado_nuevo}</p>
            <hr />
          </li>
        ))}
      </ul>
      <button className='botoncito-historial' onClick={handleCancel}>Volver</button>
    </div>
  );
};

export default HistorialCambios;
