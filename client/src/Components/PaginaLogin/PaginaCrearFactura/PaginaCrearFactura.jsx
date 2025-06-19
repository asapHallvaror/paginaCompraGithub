// src/PaginaCrearFactura.js

import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './PaginaCrearFactura.css';
import companyData from '../../../CompanyData.js';
import autoTable from 'jspdf-autotable';
import { toDataURL } from 'qrcode';
import { useAuth } from '../../../auth/AuthContext.js';
import { useNavigate, Link } from 'react-router-dom';

import axios from 'axios';
import Swal from 'sweetalert2';


const PaginaCrearFactura = () => {

    const regionesYComunas = {
        "Región de Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
        "Región de Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
        "Región de Antofagasta": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"],
        "Región de Atacama": ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"],
        "Región de Coquimbo": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"],
        "Región de Valparaíso": ["Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Calle Larga", "Rinconada", "San Esteban", "La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar", "Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María", "Quilpué", "Limache", "Olmué", "Villa Alemana"],
        "Región del Libertador General Bernardo O'Higgins": ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchihue", "Navidad", "Paredones", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"],
        "Región del Maule": ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas"],
        "Región de Ñuble": ["Chillán", "Bulnes", "Cobquecura", "Coelemu", "Coihueco", "El Carmen", "Ninhue", "Ñiquén", "Pemuco", "Pinto", "Portezuelo", "Quillón", "Quirihue", "Ránquil", "San Carlos", "San Fabián", "San Ignacio", "San Nicolás", "Treguaco", "Yungay"],
        "Región del Biobío": ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Hualpén", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío"],
        "Región de La Araucanía": ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre Las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"],
        "Región de Los Ríos": ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"],
        "Región de Los Lagos": ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué", "Palena"],
        "Región de Aysén del General Carlos Ibáñez del Campo": ["Coyhaique", "Lago Verde", "Aysén", "Cisnes", "Guaitecas", "Cochrane", "O'Higgins", "Tortel", "Chile Chico", "Río Ibáñez"],
        "Región de Magallanes y de la Antártica Chilena": ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos", "Antártica", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"],
        "Región Metropolitana de Santiago": ["Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Santiago", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"]
      };
      





    const [productos, setProductos] = useState([{ nombre: '', cantidad: 0, precio: 0, total: 0 }]);
    const [subtotal, setSubtotal] = useState(0);
    const [iva, setIVA] = useState(0);
    const [totalGeneral, setTotalGeneral] = useState(0);
    const [rut, setRut] = useState("");
    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState("");
    const [telefono, setTelefono] = useState("");
    const [correo, setCorreo] = useState("");
    
    const [numFactura, setNumFactura] = useState(null);
    const [fechaOrden, setFechaOrden] = useState('');
    const [fechaDespacho, setFechaDespacho] = useState('');


    const [rutCliente, setRutCliente] = useState('');
    const [nombreCliente, setNombreCliente] = useState('');
    const [direccionCliente, setDireccionCliente] = useState('');
    const [telefonoCliente, setTelefonoCliente] = useState('');
    const [correoCliente, setCorreoCliente] = useState('');
    
    const [regionSeleccionada, setRegionSeleccionada] = useState('');
    const [comunaSeleccionada, setComunaSeleccionada] = useState('');

    const [direccionDespacho, setDireccionDespacho] = useState('');
    const [usarDireccionCliente, setUsarDireccionCliente] = useState(false);


    const [errorRegion, setErrorRegion] = useState('');
    const [errorComuna, setErrorComuna] = useState('');

    const [errorFechaOrden, setErrorFechaOrden] = useState('');
    const [errorFechaDespacho, setErrorFechaDespacho] = useState('');


    // Manejadores de eventos para los inputs del cliente
    const handleNumFactura = (e) => setNumFactura(e.target.value);

    const handleRutChange = (e) => setRutCliente(e.target.value);
    const handleNombreChange = (e) => setNombreCliente(e.target.value);
    const handleDireccionChange = (e) => setDireccionCliente(e.target.value);
    const handleTelefonoChange = (e) => setTelefonoCliente(e.target.value);
    const handleCorreoChange = (e) => setCorreoCliente(e.target.value);
    const handleRegionChange = (event) => {
        const valor = event.target.value;
        setRegionSeleccionada(valor);
        setComunaSeleccionada(''); // Resetear comuna al cambiar la región
        //Aquí se establece el mensaje de error si no se selecciona una región
        setErrorRegion(valor ? '' : 'Debes seleccionar una región');
        //Resetea y limpia el mensaje de error de la comuna
        setErrorComuna('');
      };
    
      const handleComunaChange = (event) => {
        const valor = event.target.value;
        setComunaSeleccionada(valor);
        //Aquí se establece el mensaje de error si no se selecciona una comuna
        setErrorComuna(valor ? '' : 'Debes seleccionar una comuna');
      };
    const handleDireccionDespachoChange = (e) => setDireccionDespacho(e.target.value);
    
    const handleFechaOrdenChange = (e) => {
        const nuevaFechaOrden = e.target.value;
        setFechaOrden(nuevaFechaOrden);
    };

    const handleFechaOrdenBlur = () => {
        const fechaIngresada = new Date(fechaOrden);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0); // Asegurarse de que la fecha de hoy no tenga tiempo

        if (fechaIngresada > hoy) {
            Swal.fire({
                icon: 'error',
                title: 'Fecha inválida',
                text: 'La fecha de orden no puede ser una fecha futura.',
            });
            setFechaOrden('');
        }
    };

    const handleFechaDespachoChange = (e) => {
        const nuevaFechaDespacho = e.target.value;
        const fechaIngresada = new Date(nuevaFechaDespacho);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
    
        if (fechaIngresada >= hoy) {
            setFechaDespacho(nuevaFechaDespacho);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Fecha inválida',
                text: 'La fecha de despacho no puede ser una fecha pasada.',
            });
            setFechaDespacho('');
        }
    };
    

    const handleFechaDespachoBlur = () => {
        const fechaIngresada = new Date(fechaDespacho);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0); // Asegurarse de que la fecha de hoy no tenga tiempo
    
        if (fechaIngresada < hoy) {
            Swal.fire({
                icon: 'error',
                title: 'Fecha inválida',
                text: 'La fecha de despacho no puede ser una fecha pasada.',
            });
            setFechaDespacho('');
        }
    };
    

    const handleSubtotalChange = (e) => setSubtotal(e.target.value);
    const handleIvaChange = (e) => setIVA(e.target.value);
    const handleTotalGeneralChange= (e) => setTotalGeneral(e.target.value);


    const navigate = useNavigate();


    const userData = JSON.parse(localStorage.getItem('user'));
    const auth = useAuth();

    const handleLogout = () => {
        auth.signout(() => {
          // Redirige al usuario después de cerrar sesión
          window.location.href = '/'; // Por ejemplo, redirige a la página de inicio
        });
    };

    const agregarProducto = () => {
        setProductos([...productos, { nombre: '', cantidad: 0, precio: 0, total: 0 }]);
    };

    const eliminarProducto = (index) => {
        if (productos.length > 1) {
            const newProductos = productos.filter((_, i) => i !== index);
            setProductos(newProductos);
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Debe haber al menos un producto!",
              });
        }
    };
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (!isLoggedIn) {
            handleLogout(); // Redirigir si no está autenticado
        }
    }, []);


    
    

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

    const handleCheckboxChange = (event) => {
        setUsarDireccionCliente(event.target.checked);
        if (event.target.checked) {
            // Copia la dirección del cliente al despacho
            setDireccionDespacho(direccionCliente);
        } else {
            // Limpia el campo de dirección de despacho
            setDireccionDespacho('');
        }
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

    const enviarFactura = async (facturaData) => {
        try {
            const response = await axios.post('http://localhost:3001/api/facturas', facturaData);
            console.log('Factura enviada correctamente:', response.data);
            if (response.data.success) {
                return response.data.numero_orden;
            } else {
                console.error('Error al enviar la factura:', response.data.message);
                return null;
            }
        } catch (error) {
            console.error('Error al enviar la factura:', error.message, error.response?.data);
            return null; // Ensure that null is returned if there's an error
        }
    };
    
    
    
    const handleSubmit = async event => {
        event.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
    
        if (user) {
            const { RAZON_SOCIAL, RUT, DIRECCION, TELEFONO, CORREO, SITIO_WEB, TIPO_SERVICIO } = user;
    
            // Convertir productos a JSON
            const productosJSON = JSON.stringify(productos);
    
            // Construir los datos de la factura, incluyendo la lista de productos
            const facturaData = {
                fecha_orden: fechaOrden,
                rut_proveedor: RUT,
                razon_social_proveedor: RAZON_SOCIAL,
                direccion_proveedor: DIRECCION,
                telefono_proveedor: TELEFONO,
                correo_proveedor: CORREO,
                sitio_web_proveedor: SITIO_WEB,
                tipo_servicio: TIPO_SERVICIO,
                rut_cliente: rutCliente,
                nombre_cliente: nombreCliente,
                direccion_cliente: direccionCliente,
                telefono_cliente: telefonoCliente,
                correo_cliente: correoCliente,
                subtotal: subtotal,
                iva: iva,
                total: totalGeneral,
                productos: productosJSON, // Enviar productos como cadena JSON
                regionDespacho: regionSeleccionada,
                comunaDespacho: comunaSeleccionada,
                direccionDespacho: direccionDespacho,
                fechaDespacho: fechaDespacho
            };
    
            // Enviar los datos de la factura al servidor
            const numero_orden = await enviarFactura(facturaData);
            if (numero_orden) {
                setNumFactura(numero_orden);  // Actualizar numFactura con el numero_orden retornado
            }
            Swal.fire({
                title: "Factura creada con éxito!",
                icon: 'success',
                text: "Serás redirigido a la página con los detalles de la factura",
            }).then(() => {
                navigate(`/detalle/${numero_orden}`) // Usar numero_orden en lugar de numFactura
            });
        } else {
            console.log('No user data found in localStorage');
        }
    };
    
    
    
    
    


    return (
        <div>
            <Link to='/home' >
                <button className='btn-volver'>
                    <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path></svg>
                    <span>Volver</span>
                </button>
            </Link>
            <h2 style={{textAlign: 'center', marginTop: '50px'}}>Orden de Compra</h2>
            <form onSubmit={handleSubmit}>
                <table>
                    <thead>
                    <th>Fecha orden</th>
                    </thead>
                    <tbody>
                        <tr>
                            <input className='fecha-input' type="date" name='fechaOrden' required value={fechaOrden} onChange={handleFechaOrdenChange} onBlur={handleFechaOrdenBlur}/>
                            {errorFechaOrden && <p style={{ color: 'red' }}>{errorFechaOrden}</p>}
                        </tr>
                    </tbody>
                </table>
                <h3 style={{textAlign: 'center', marginTop: '30px'}}>Datos empresa proveedora</h3>
                <table>
                    <thead>
                        <th>Rut empresa*</th>
                        <th>Razón social*</th>
                        <th>Direccion*</th>
                        <th>Teléfono*</th>
                        <th>Correo*</th>
                        <th>Sitio web</th>
                        <th>Tipo servicio</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type="text" value={userData.RUT} name='rutEmpProv' placeholder='Ingresa rut empresa' required minLength="10" maxLength="10"/></td>
                            <td><input type="text" value={userData.RAZON_SOCIAL} name='nomEmpProv' placeholder='Ingresa nombre empresa' required minLength="5" maxLength="45"/></td>
                            <td><input type="text" value={userData.DIRECCION} name='dirEmpProv' placeholder='Ingresa direccion empresa' required minLength="5" maxLength="45"/></td>
                            <td><input type="number" value={userData.TELEFONO} name='telEmpProv' placeholder='Ingresa teléfono' required/></td>
                            <td><input type="email" value={userData.CORREO} name='mailEmpProv' placeholder='Ingresa correo' required/></td>
                            <td><input type="text" value={userData.SITIO_WEB} name='webEmpProv' placeholder='Ingresa página web'/></td>
                            <td><input type="text" value={userData.TIPO_SERVICIO} name='servEmpProv' placeholder='Ingresa tipo de servicio'/></td>
                        </tr>
                    </tbody>
                </table>
                <h3 style={{textAlign: 'center', marginTop: '30px'}}>Datos empresa cliente</h3>
                <table>
                    <thead>
                        <th>Rut*</th>
                        <th>Nombre o razón social*</th>
                        <th>Direccion*</th>
                        <th>Teléfono*</th>
                        <th>Correo*</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <input 
                                    type="text" 
                                    name='rutEmpCliente' 
                                    placeholder='Ingresa rut' 
                                    required 
                                    minLength="10" 
                                    maxLength="10" 
                                    value={rutCliente} 
                                    onChange={handleRutChange} 
                                />
                            </td>
                            <td>
                                <input 
                                    type="text" 
                                    name='nomEmpCliente' 
                                    placeholder='Ingresa nombre' 
                                    required 
                                    minLength="3" 
                                    maxLength="45" 
                                    value={nombreCliente} 
                                    onChange={handleNombreChange} 
                                />
                            </td>
                            <td>
                                <input 
                                    type="text" 
                                    name='dirEmpCliente' 
                                    placeholder='Ingresa direccion' 
                                    required 
                                    minLength="5" 
                                    maxLength="45" 
                                    value={direccionCliente} 
                                    onChange={handleDireccionChange} 
                                />
                            </td>
                            <td>
                                <input 
                                    type="number" 
                                    name='telEmpCliente' 
                                    placeholder='Ingresa teléfono' 
                                    required 
                                    value={telefonoCliente} 
                                    onChange={handleTelefonoChange} 
                                />
                            </td>
                            <td>
                                <input 
                                    type="email" 
                                    name='mailEmpCliente' 
                                    placeholder='Ingresa correo' 
                                    required 
                                    value={correoCliente} 
                                    onChange={handleCorreoChange} 
                                />
                            </td>

                        </tr>
                    </tbody>
                </table>
                <h3 style={{textAlign: 'center', marginTop: '30px'}}>Datos de despacho</h3>
                <div className='dirCheckbox'>
                    <input 
                        type="checkbox" 
                        className='dirCheckbox'
                        checked={usarDireccionCliente} 
                        onChange={handleCheckboxChange} 
                    /> <p>Usar la misma dirección del cliente para despacho</p>
                </div>
                <table>
                    <thead>
                        <th>Región*</th>
                        <th>Comuna*</th>
                        <th>Dirección*</th>
                        <th>Fecha estimada de entrega*</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <select required id="region" value={regionSeleccionada} onChange={handleRegionChange} className='comboregioncomuna'>
                                    <option value="">Seleccionar una región</option>
                                    {Object.keys(regionesYComunas).map((region) => (
                                        <option key={region} value={region}>{region}</option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <select required id="comuna" value={comunaSeleccionada} onChange={handleComunaChange} disabled={!regionSeleccionada} className='comboregioncomuna'>
                                    <option value="">Selecciona una comuna</option>
                                    {regionSeleccionada &&
                                        regionesYComunas[regionSeleccionada].map((comuna) => (
                                        <option key={comuna} value={comuna}>{comuna}</option>
                                        ))}
                                </select>
                            </td>
                            <td>
                                <input 
                                    type="text" 
                                    name='dirDespacho' 
                                    placeholder='Ingresa direccion de despacho' 
                                    required 
                                    minLength="5" 
                                    maxLength="45" 
                                    value={direccionDespacho} 
                                    onChange={handleDireccionDespachoChange} 
                                />
                            </td>
                            <td>
                                <input className='fecha-input' type="date" name='fechaDespacho' required value={fechaDespacho} onChange={handleFechaDespachoChange} onBlur={handleFechaDespachoBlur}/>
                                {errorFechaDespacho && <p style={{ color: 'red' }}>{errorFechaDespacho}</p>}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <h3 style={{textAlign: 'center', marginTop: '30px'}}>Datos productos</h3>
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
                                <td><input type="text" name="nombre" value={producto.nombre} onChange={e => {if (e.target.value === '' || !e.target.value.match(/^ *$/)) {handleInputChange(index, e);}}}  placeholder='Ingresa nombre de producto' required minLength="4" maxLength="45" /></td>
                                <td><input type="number" placeholder='Ingresa cantidad del producto' name="cantidad" value={producto.cantidad} onChange={e => handleInputChange(index, e)} min="1" required /></td>
                                <td><input type="number" name="precio" placeholder='Ingresa precio' value={producto.precio} onChange={e => handleInputChange(index, e)} min="0.01" step="0.01" required /></td>
                                <td><input type="text" value={producto.total} readOnly /></td>
                                <td><button type="button" className="botones-form" onClick={() => eliminarProducto(index)}>Eliminar</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button type="button" className="boton-agregar" onClick={agregarProducto}>Agregar Producto</button>
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
                    <button type="submit" className="botones-form">Generar Factura</button>
                </div>
            </form>
        </div>
    );
};

export default PaginaCrearFactura;
