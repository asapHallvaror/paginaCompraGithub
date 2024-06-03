import React from 'react'
import './HomePage.css'
import { Link } from 'react-router-dom'

const HomePage = () => {
  const fecha = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const fechaCapitalized = fecha.split(' ').map(capitalizeFirstLetter).join(' ');

  return (
    <div>
        <div className="home-container">
            <div className="header-home">
                <h1>Bienvenid@ Lorem Ipsum</h1>
                <p>{fechaCapitalized}</p>
            </div>
            <div className="middle-container">
                <Link to='/factura'>
                    <button className='Btn'>
                        <span>Crear nueva factura</span>
                    </button>
                </Link>
            </div>
            <div className="bottom-container">
                <h2>Tus facturas</h2>
                <table>
                    <thead>
                        <th>Número orden</th>
                        <th>Fecha orden</th>
                        <th>Ver detalle factura</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <p>12345</p>
                            </td>
                            <td>
                                01/06/2024
                            </td>
                            <td>
                                <button style={{marginLeft: '30px'}}>Ver detalle</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}

export default HomePage