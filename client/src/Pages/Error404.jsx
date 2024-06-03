import React from 'react';
import './CSS/Error404.css';
import sadTravis from '../Components/Assets/travisTriste.gif';

const Error404 = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="container">
        <div className="texto-container">
            <h1>Oops, la página a la que quieres acceder no existe :c</h1>
            <p>Quizás escribiste algo mal, o simplemente la url de la página cambio.</p>
        </div>
        <div className="gif-container">
            <img src={sadTravis} alt="Travis triste" />
        </div>
        <div className="boton-container">
            <button className='Btn' onClick={handleGoBack}><span>Volver a la página anterior</span></button>
        </div>
    </div>
  );
};

export default Error404;
