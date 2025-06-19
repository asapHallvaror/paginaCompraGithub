<h1 align="center">Proyecto colaborativo venta de discos</h1>
<h1 align="center">
    <img src="https://github.com/asapHallvaror/paginaCompraGithub/assets/128053015/ff69859c-7cf7-4c4e-819d-06ff1eca742e"/>
</h1>
<p align="center">Hecho por: Álvaro Morales y Vicente Zapata</p>
<p align="center">Proyecto desarrollado en React. Base de datos MYSQL.</p>
<div align="center">
    
  <h1>Propósito</h1>
  <p>Este proyecto permite crear facturas a partir de órdenes de compras. La persona que ingrese a la página podrá ingresar los productos que necesite y esta calculará todo lo correspondiente a la factura, una vez esté todo listo, debe hacer click en el botón generar factura y se descargará en formato PDF. Las facturas de cada cliente quedarán guardadas en la base de datos y este podrá acceder a ellas cuando lo vea necesario.</p>
  <p><strong>Además debe tener un botón el cual agregue más productos y uno para eliminar los productos</strong> (en caso de que la empresa cliente requiera)</p>
  <h2>La factura final debería asemejarse a la siguiente:</h2>
  <img src="https://github.com/asapHallvaror/paginaCompraGithub/assets/128053015/a53f6baf-9e63-40ad-8295-96946b53fda8" />
  
<h1>📦 Sistema de Gestión de Facturas</h1>

<h2>🧰 Requisitos Previos</h2>
<ul>
  <li>✅ Node.js: <a href="https://nodejs.org/">https://nodejs.org/</a></li>
  <li>✅ SQL Server Management Studio 18 (SSMS): <a href="https://learn.microsoft.com/es-es/sql/ssms/download-sql-server-management-studio-ssms">Descargar aquí</a></li>
  <li>✅ Git (opcional, si deseas clonar el repositorio)</li>
</ul>

<hr />

<h2>🛠️ Instalación del Proyecto</h2>

<h3>1. Descargar o clonar el repositorio</h3>
<pre><code>https://github.com/TU-USUARIO/paginaCompraGithub.git</code></pre>
<p>O descarga el archivo ZIP desde GitHub y descomprímelo.</p>

<h3>2. Instalación de dependencias</h3>
<p>Ejecuta los siguientes comandos desde una terminal:</p>

<h4>📁 Client</h4>
<pre><code>cd client
npm install</code></pre>

<h4>📁 Server</h4>
<pre><code>cd ../server
npm install</code></pre>

<h3>3. Configurar la conexión a la base de datos</h3>
<p>Abre el archivo <code>server/index.js</code> y modifica este bloque con los datos de tu instalación de SQL Server:</p>

<pre><code>const config = {
  user: 'sa',
  password: 'TU_CONTRASEÑA',
  server: 'localhost', // Puede ser 'localhost', '.', o 'localhost\\SQLEXPRESS'
  database: 'yzymusic',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  port: 1433
};
</code></pre>

<hr />

<h2>🧩 Crear Base de Datos en SSMS</h2>
<ol>
  <li>Abre <strong>SQL Server Management Studio 18</strong>.</li>
  <li>Conéctate a tu instancia local.</li>
  <li>Abre el archivo SQL llamado "yzymusic.sql" y ejecutalo</li>
  <li>Haz click derecho en la base de datos creada -> New query</li>
  <li>Abrir el archivo "CONSULTASYZYMUSIC", copiar y pegar su contenido en la zona de consulta y ejecutar paso a paso los triggers, funciones y procedimientos</li>

</ol>

<hr />

<h2>🚀 Levantar el Proyecto</h2>
<ol>
  <li>Abre una terminal en la carpeta <code>server</code> y ejecuta:</li>
</ol>
<pre><code>node index.js</code></pre>

<ol start="2">
  <li>Abre otra terminal en la carpeta <code>client</code> y ejecuta:</li>
</ol>
<pre><code>npm start</code></pre>

<p>La aplicación se abrirá automáticamente en <a href="http://localhost:3000" target="_blank">http://localhost:3000</a>.</p>

<hr />

<h2>🧪 Acceso de prueba</h2>
<p>Puedes usar uno de los usuarios ya insertados mediante el script SQL. Si necesitas nuevos usuarios, insértalos directamente en la tabla <code>usuario</code>.</p>

<hr />

<h2>📌 Consideraciones</h2>
<ul>
  <li>Ya se incluyen todos los <strong>triggers</strong>, <strong>funciones</strong> y <strong>procedimientos almacenados</strong> requeridos.</li>
  <li>El sistema implementa:</li>
  <ul>
    <li>Creación, rectificación y anulación de facturas</li>
    <li>Registro automático de historial de cambios</li>
    <li>Eliminación lógica de facturas</li>
    <li>Logs internos mediante triggers</li>
  </ul>
  <li>Asegúrate de que el puerto <code>1433</code> esté abierto en tu firewall si usas SQL Server.</li>
</ul>

<hr />

<h2>🤝 Autores</h2>
<p>Este proyecto fue desarrollado como por Vicente Zapata y Álvaro Morales.</p>

  
  
  <h1>Contexto</h1>
  <p>YZY Music es una empresa de venta de discos al por mayor, debido a la alta demanda de compras, decidieron automatizar el proceso de creación de facturas a partir de órdenes de compras, este proceso consiste en tomar los datos de la orden de compra y calcular los valores por producto para generar la factura. Una vez automatizado este proceso, solo queda ingresar los datos de la orden de compra en la web, y esta calcula todo para luego generar la factura en formato PDF. </p>
  <p>
  <h1></h1>
</div>
