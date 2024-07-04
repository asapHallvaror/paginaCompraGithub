import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FacturaEvidencia = ({ idFactura }) => {
    const [imagenUrl, setImagenUrl] = useState('');

    useEffect(() => {
        const fetchImagenEvidencia = async () => {
            try {
                const response = await axios.get(`/api/factura/evidencia/${idFactura}`);
                setImagenUrl(response.request.responseURL); // Guarda la URL de la imagen
            } catch (error) {
                console.error('Error al cargar la imagen de evidencia:', error.message);
            }
        };

        fetchImagenEvidencia();
    }, [idFactura]);

    return (
        <div>
            {imagenUrl && <img src={imagenUrl} alt="Evidencia de entrega" />}
        </div>
    );
};

export default FacturaEvidencia;
