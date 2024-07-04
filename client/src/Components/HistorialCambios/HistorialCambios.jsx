import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

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
    <div>
      <h1>Historial de Cambios de Factura N° {id}</h1>
      <ul>
        {historialCambios.map((cambio, index) => (
          <li key={index}>
            <p>Fecha de Cambio: {cambio.fecha_cambio}</p>
            <p>Estado Nuevo: {cambio.estado_nuevo}</p>
            <hr />
          </li>
        ))}
      </ul>
      <button onClick={handleCancel}>Volver</button>
    </div>
  );
};

export default HistorialCambios;
