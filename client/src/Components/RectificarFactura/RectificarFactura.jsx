import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './RectificarFactura.css';
import Swal from 'sweetalert2';


const EditarFactura = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [factura, setFactura] = useState(null);
    const [initialFactura, setInitialFactura] = useState(null);

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

    const [regionSeleccionada, setRegionSeleccionada] = useState('');
    const [comunasDisponibles, setComunasDisponibles] = useState([]);




    useEffect(() => {
        const fetchFactura = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/factura/${id}`);
                const facturaData = response.data;
                facturaData.productos.forEach(producto => {
                    producto.total = producto.precio * producto.cantidad; 
                });
                setFactura(facturaData);
                setInitialFactura(facturaData); 
                setRegionSeleccionada(facturaData.regionDespacho || '');
                setComunasDisponibles(regionesYComunas[facturaData.regionDespacho] || []);

            } catch (error) {
                console.error('Error al obtener los detalles de la factura:', error.message, error.response?.data);
            }
        };
        fetchFactura();
    }, [id]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFactura({ ...factura, [name]: value });
    };

    const handleProductChange = (index, event) => {
        const { name, value } = event.target;
        const productos = [...factura.productos];
        productos[index] = { ...productos[index], [name]: value };
        productos[index].total = productos[index].precio * productos[index].cantidad; // Recalcular el total del producto
        setFactura({ ...factura, productos });
    };

    const handleProductAdd = () => {
        const nuevoProducto = { nombre: '', precio: 0, cantidad: 1, total: 0 };
        setFactura({ ...factura, productos: [...factura.productos, nuevoProducto] });
    };

    const handleProductDelete = (index) => {
        if (factura.productos.length > 1) {
            const productos = factura.productos.filter((_, i) => i !== index);
            setFactura({ ...factura, productos });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'No puedes eliminar el único producto que está en la factura!',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }
    };

    const handleRegionChange = (e) => {
    const region = e.target.value;
    setRegionSeleccionada(region);
    setComunasDisponibles(regionesYComunas[region] || []);
    setFactura(prev => ({ ...prev, regionDespacho: region, comunaDespacho: '' }));
    };

    const handleComunaChange = (e) => {
    const comuna = e.target.value;
    setFactura(prev => ({ ...prev, comunaDespacho: comuna }));
    };


    const formatDateForMySQL = (dateString) => {
        const date = new Date(dateString);
        let month = '' + (date.getMonth() + 1),
            day = '' + date.getDate(),
            year = date.getFullYear();
      
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
      
        return [year, month, day].join('-');
    };

    const calcularSubtotal = () => {
        if (!factura || !factura.productos) return 0;
        return Math.round(factura.productos.reduce((total, producto) => total + producto.total, 0));
    };

    const calcularIva = (subtotal) => {
        const iva = Math.round(subtotal * 0.19); // IVA del 19%
        return iva;
    };

    const calcularTotal = (subtotal, iva) => {
        const total = Math.round(subtotal + iva);
        return total;
    };

    const handleSubmit = async (event) => {
    event.preventDefault();

        const confirm = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Realmente quieres confirmar las modificaciones?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'Cancelar'
        });

        if (!confirm.isConfirmed) return;

        try {
            // Calcular valores actualizados
            const subtotal = calcularSubtotal();
            const iva = calcularIva(subtotal);
            const total = calcularTotal(subtotal, iva);

            // Construir objeto factura sin productos
            const facturaCabecera = {
                ...factura,
                subtotal,
                iva,
                total,
                fecha_orden: formatDateForMySQL(factura.fecha_orden),
                fechaDespacho: formatDateForMySQL(factura.fechaDespacho),
                estado_factura: 'rectificada'
            };
            delete facturaCabecera.productos;
            delete facturaCabecera.numero_orden;

            await axios.put(`http://localhost:3001/api/factura/${id}`, facturaCabecera);

            await axios.put(`http://localhost:3001/api/factura/${id}/detalle`, { productos: factura.productos });

            await Swal.fire({
                title: '¡Factura rectificada!',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            navigate('/home');
        } catch (error) {
            console.error('Error al actualizar la factura:', error.message);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo actualizar la factura',
                icon: 'error'
            });
        }
    };


    const handleCancel = () => {
        navigate(-1);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        let month = '' + (date.getMonth() + 1),
            day = '' + date.getDate(),
            year = date.getFullYear();
      
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
      
        return [year, month, day].join('-');
    };

    if (!factura) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <h1 className='h1corte'>Rectificar Factura N° {factura.numero_orden}</h1>
            <p className='pcorte'>En esta página puedes modificar los datos que requieras de la factura!</p>
            <form onSubmit={handleSubmit} className='formulario-factura'>
                <table className="factura-table">
                    <tbody>
                        <tr>
                            <td><label>Número de Factura:</label></td>
                            <td><input type="text" name="numero_orden" value={factura.numero_orden} onChange={handleInputChange} disabled/></td>
                            <td><label>Fecha de Factura:</label></td>
                            <td><input type="date" name="fecha_orden" value={formatDate(factura.fecha_orden)} onChange={handleInputChange} /></td>
                            <td><label>Estado de la factura:</label></td>
                            <td><input type="text" name="estado_factura" value={factura.estado_factura} onChange={handleInputChange} disabled/></td>
                        </tr>
                    </tbody>
                </table>
                <h2 className='h1corte'>Datos proveedor</h2>
                <table className='factura-table'>
                    <tbody>
                        <tr>
                            <td><label>Rut:</label></td>
                            <td><input type="text" name="rut_proveedor" value={factura.rut_proveedor} onChange={handleInputChange}  required minLength='9' maxLength='10'/></td>
                            <td><label>Razón social:</label></td>
                            <td><input type="text" name="razon_social_proveedor" value={factura.razon_social_proveedor} onChange={handleInputChange} required minLength="5" maxLength="45"/></td>
                            <td><label>Dirección:</label></td>
                            <td><input type="text" name="direccion_proveedor" value={factura.direccion_proveedor} onChange={handleInputChange} required minLength="5" maxLength="45"/></td>
                        </tr>
                        <tr>
                            <td><label>Teléfono:</label></td>
                            <td><input type="number" name="telefono_proveedor" value={factura.telefono_proveedor} onChange={handleInputChange} required/></td>
                            <td><label>Correo:</label></td>
                            <td><input type="text" name="correo_proveedor" value={factura.correo_proveedor} onChange={handleInputChange} required/></td>
                            <td><label>Sitio Web:</label></td>
                            <td><input type="text" name="sitio_web_proveedor" value={factura.sitio_web_proveedor} onChange={handleInputChange}/></td>
                        </tr>
                        <tr>
                            <td><label>Tipo Servicio:</label></td>
                            <td><input type="text" name="tipo_servicio" value={factura.tipo_servicio} onChange={handleInputChange} /></td>
                        </tr>
                    </tbody>
                </table>
                <h2 className='h1corte'>Datos cliente</h2>
                <table className="factura-table">
                    <tbody>
                        <tr>
                            <td><label>Rut:</label></td>
                            <td><input type="text" name="rut_cliente" value={factura.rut_cliente} onChange={handleInputChange} required minLength='9' maxLength='10'/></td>
                            <td><label>Nombre/Razón social:</label></td>
                            <td><input type="text" name="nombre_cliente" value={factura.nombre_cliente} onChange={handleInputChange} required minLength="3" maxLength="45"/></td>
                            <td><label>Dirección:</label></td>
                            <td><input type="text" name="direccion_cliente" value={factura.direccion_cliente} onChange={handleInputChange} required minLength="3" maxLength="80"/></td>
                        </tr>
                        <tr>
                            <td><label>Teléfono:</label></td>
                            <td><input type="text" name="telefono_cliente" value={factura.telefono_cliente} onChange={handleInputChange} required /></td>
                            <td><label>Correo:</label></td>
                            <td><input type="text" name="correo_cliente" value={factura.correo_cliente} onChange={handleInputChange} required/></td>
                        </tr>
                    </tbody>
                </table>

                <h2 className='h1corte'>Productos</h2>
                <table className="productos-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Precio Unitario</th>
                            <th>Cantidad</th>
                            <th>Total</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {factura.productos.map((producto, index) => (
                            <tr key={index}>
                                <td><input type="text" name="nombre" value={producto.nombre} onChange={(event) => handleProductChange(index, event)} /></td>
                                <td><input type="number" name="precio" value={producto.precio} onChange={(event) => handleProductChange(index, event)} /></td>
                                <td><input type="number" name="cantidad" value={producto.cantidad} onChange={(event) => handleProductChange(index, event)} /></td>
                                <td><input type="number" name="total" value={Math.round(producto.total)} disabled /></td>
                                <td><button type="button" onClick={() => handleProductDelete(index)}>Eliminar Producto</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button type="button" onClick={handleProductAdd}>Agregar Producto</button>

                <h2 className='h1corte'>Datos de despacho</h2>
                <table className="factura-table">
                    <tbody>
                    <tr>
                        <td><label>Región:</label></td>
                        <td>
                        <select value={regionSeleccionada} onChange={handleRegionChange} required>
                            <option value="">Seleccione región</option>
                            {Object.keys(regionesYComunas).map((region, index) => (
                            <option key={index} value={region}>{region}</option>
                            ))}
                        </select>
                        </td>

                        <td><label>Comuna:</label></td>
                        <td>
                        <select value={factura.comunaDespacho || ''} onChange={handleComunaChange} required>
                            <option value="">Seleccione comuna</option>
                            {comunasDisponibles.map((comuna, index) => (
                            <option key={index} value={comuna}>{comuna}</option>
                            ))}
                        </select>
                        </td>

                        <td><label>Dirección</label></td>
                        <td><input type="text" name="direccionDespacho" value={factura.direccionDespacho} onChange={handleInputChange} required /></td>
                    </tr>
                    <tr>
                        <td><label>Fecha estimada de entrega:</label></td>
                        <td><input type="date" name="fechaDespacho" value={formatDate(factura.fechaDespacho)} onChange={handleInputChange} required /></td>
                    </tr>
                    </tbody>
                </table>

                <h2 className='h1corte'>Valores finales</h2>
                <table className="factura-table">
                    <tbody>
                        <tr>
                            <td><label>Subtotal</label></td>
                            <td><input type="number" name='subtotal' value={Math.round(calcularSubtotal())} onChange={handleInputChange} disabled/></td>
                            <td><label>Iva</label></td>
                            <td><input type="number" name='iva' value={Math.round(calcularIva(calcularSubtotal()))} onChange={handleInputChange} disabled/></td>
                            <td><label>Total</label></td>
                            <td><input type="number" name='total' value={Math.round(calcularTotal(calcularSubtotal(), calcularIva(calcularSubtotal())))} onChange={handleInputChange} disabled/></td>
                        </tr>
                    </tbody>
                </table>

                <div className="botones-container">
                    <button type="submit">Confirmar Cambios</button>
                    <button type="button" onClick={handleCancel}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default EditarFactura;