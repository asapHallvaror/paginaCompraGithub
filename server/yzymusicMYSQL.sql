/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE IF NOT EXISTS `yzymusic` /*!40100 DEFAULT CHARACTER SET utf16 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `yzymusic`;

CREATE TABLE IF NOT EXISTS `facturas` (
  `numero_orden` int NOT NULL AUTO_INCREMENT,
  `fecha_orden` date DEFAULT NULL,
  `rut_proveedor` varchar(255) DEFAULT NULL,
  `razon_social_proveedor` varchar(255) DEFAULT NULL,
  `direccion_proveedor` varchar(255) DEFAULT NULL,
  `telefono_proveedor` varchar(15) DEFAULT NULL,
  `correo_proveedor` varchar(255) DEFAULT NULL,
  `sitio_web_proveedor` varchar(255) DEFAULT NULL,
  `tipo_servicio` varchar(255) DEFAULT NULL,
  `rut_cliente` varchar(255) DEFAULT NULL,
  `nombre_cliente` varchar(255) DEFAULT NULL,
  `direccion_cliente` varchar(255) DEFAULT NULL,
  `telefono_cliente` varchar(15) DEFAULT NULL,
  `correo_cliente` varchar(255) DEFAULT NULL,
  `subtotal` int DEFAULT NULL,
  `iva` int DEFAULT NULL,
  `total` int DEFAULT NULL,
  `productos` json DEFAULT NULL,
  `regionDespacho` varchar(90) DEFAULT NULL,
  `comunaDespacho` varchar(90) DEFAULT NULL,
  `direccionDespacho` varchar(90) DEFAULT NULL,
  `fechaDespacho` date DEFAULT NULL,
  `estado_factura` enum('creada','rectificada','anulada') DEFAULT 'creada',
  `estado_entrega` varchar(50) DEFAULT 'por entregar',
  `motivo_rechazo` text,
  `direccion_entrega` varchar(255) DEFAULT NULL,
  `rut_receptor` varchar(255) DEFAULT NULL,
  `foto_evidencia` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`numero_orden`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf16;

INSERT INTO `facturas` (`numero_orden`, `fecha_orden`, `rut_proveedor`, `razon_social_proveedor`, `direccion_proveedor`, `telefono_proveedor`, `correo_proveedor`, `sitio_web_proveedor`, `tipo_servicio`, `rut_cliente`, `nombre_cliente`, `direccion_cliente`, `telefono_cliente`, `correo_cliente`, `subtotal`, `iva`, `total`, `productos`, `regionDespacho`, `comunaDespacho`, `direccionDespacho`, `fechaDespacho`, `estado_factura`, `estado_entrega`, `motivo_rechazo`, `direccion_entrega`, `rut_receptor`, `foto_evidencia`) VALUES
	(1, '2024-07-22', '75456765-2', 'YZY MUSIC S.A LTDA', 'Pasaje Los Pehuenches 1547', '954993343', 'yzymusic@gmail.com', 'yzymusic.com', 'Venta de vinilos y cds', '21315887-2', 'Álvaro Morales', 'Los Pehuenches #1547', '954993343', 'alvaromorales@gmail.com', 40970, 7784, 48754, '[{"total": "19980", "nombre": "CD VULTURES 2", "precio": "9990", "cantidad": "2"}, {"total": "20990", "nombre": "Album Staydom STAYC", "precio": "20990", "cantidad": "1"}]', 'Región Metropolitana de Santiago', 'Puente Alto', 'Los Pehuenches #1547', '2024-07-28', 'anulada', 'rechazada', 'No estaba de nuevo en casa', NULL, NULL, NULL),
	(2, '2024-07-15', '75456765-2', 'YZY MUSIC S.A LTDA', 'Pasaje Los Pehuenches 1547', '954993343', 'yzymusic@gmail.com', 'yzymusic.com', 'Venta de vinilos y cds', '21315887-2', 'Álvaro Morales', 'Los Pehuenches #1547', '954993343', 'alvaromorales@gmail.com', 98970, 18804, 117774, '[{"total": "9990", "nombre": "CD VULTURES 1", "precio": "9990", "cantidad": "1"}, {"total": "37990", "nombre": "VINILO RODEO", "precio": "37990", "cantidad": "1"}, {"total": "50990", "nombre": "VINILO THE BENDS", "precio": "50990", "cantidad": "1"}]', 'Región Metropolitana de Santiago', 'Puente Alto', 'Los Pehuenches #1547', '2024-07-23', 'rectificada', 'entregada', NULL, 'Calle Nostalgia Ultra', '21315887-2', 'foto_evidencia-1721094064723-958461062.jpg'),
	(3, '2024-07-15', '75456765-2', 'YZY MUSIC S.A LTDA', 'Pasaje Los Pehuenches 1547', '954993343', 'yzymusic@gmail.com', 'yzymusic.com', 'Venta de vinilos y cds', '75432345-2', 'Juan Basso LTDA.', 'Calle Twice 132', '954993343', 'jua.basso@jb.com', 9990, 1898, 10180, '[{"total": 9990, "nombre": "CD VULTURES 1", "precio": "9990", "cantidad": "1"}]', 'Región Metropolitana de Santiago', 'Puente Alto', 'Calle Twice 132', '2024-07-22', 'creada', 'entregada', NULL, 'Calle Nostalgia Ultra', '21315887-2', 'foto_evidencia-1721098132841-748843064.jpg'),
	(4, '2024-07-15', '75456765-2', 'YZY MUSIC S.A LTDA', 'Pasaje Los Pehuenches 1547', '954993343', 'yzymusic@gmail.com', 'yzymusic.com', 'Venta de vinilos y cds', '23456789-2', 'Joaquín Palacios', 'Avenida San Carlos 445', '975936253', 'joa.palacios@gmail.com', 149700, 28443, 152544, '[{"total": 149700, "nombre": "CD SORRY ESTOY EN MI DARKERA", "precio": "4990", "cantidad": "30"}]', 'Región Metropolitana de Santiago', 'Puente Alto', 'Avenida San Carlos 445', '2024-07-16', 'anulada', 'por entregar', NULL, NULL, NULL, NULL),
	(5, '2024-07-16', '75456765-2', 'YZY MUSIC S.A LTDA', 'Pasaje Los Pehuenches 1547', '954993343', 'yzymusic@gmail.com', 'yzymusic.com', 'Venta de vinilos y cds', '12903328-2', 'Marcelinho', 'Calle Zinedine Zidane 123', '961823421', 'marcelinho@gmail.com', 32970, 6264, 33596, '[{"total": 32970, "nombre": "CD VULTURES 1", "precio": "10990", "cantidad": "3"}]', 'Región Metropolitana de Santiago', 'Puente Alto', 'Calle Zinedine Zidane 123', '2024-07-18', 'creada', 'rechazada', 'No salió nadie a recibirlo', NULL, NULL, NULL);

CREATE TABLE IF NOT EXISTS `historial_facturas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numero_orden` int DEFAULT NULL,
  `estado_nuevo` varchar(50) DEFAULT NULL,
  `motivo_rechazo` text,
  `direccion_entrega` varchar(255) DEFAULT NULL,
  `rut_receptor` varchar(255) DEFAULT NULL,
  `foto_evidencia` varchar(255) DEFAULT NULL,
  `fecha_cambio` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `numero_orden` (`numero_orden`),
  CONSTRAINT `historial_facturas_ibfk_1` FOREIGN KEY (`numero_orden`) REFERENCES `facturas` (`numero_orden`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf16;

INSERT INTO `historial_facturas` (`id`, `numero_orden`, `estado_nuevo`, `motivo_rechazo`, `direccion_entrega`, `rut_receptor`, `foto_evidencia`, `fecha_cambio`) VALUES
	(1, 1, 'rechazada', 'No estaba en casa', NULL, NULL, NULL, '2024-07-15 23:30:20'),
	(2, 1, 'rechazada', 'No estaba de nuevo en casa', NULL, NULL, NULL, '2024-07-15 23:30:38'),
	(3, 1, 'anulada', NULL, NULL, NULL, NULL, '2024-07-15 23:31:00'),
	(4, 2, 'rechazada', 'No quiso recibir nada', NULL, NULL, NULL, '2024-07-15 23:54:47'),
	(5, 2, 'entregada', NULL, 'Calle Nostalgia Ultra', '21315887-2', 'foto_evidencia-1721094064723-958461062.jpg', '2024-07-16 01:41:05'),
	(6, 3, 'creada', NULL, NULL, NULL, NULL, '2024-07-16 02:36:54'),
	(7, 3, 'por_entregar', NULL, NULL, NULL, NULL, '2024-07-16 02:37:03'),
	(8, 3, 'por entregar', NULL, NULL, NULL, NULL, '2024-07-16 02:37:24'),
	(9, 3, 'creada', NULL, NULL, NULL, NULL, '2024-07-16 02:40:41'),
	(10, 3, 'por entregar', NULL, NULL, NULL, NULL, '2024-07-16 02:41:19'),
	(11, 3, 'creada', NULL, NULL, NULL, NULL, '2024-07-16 02:47:30'),
	(12, 3, 'por entregar', NULL, NULL, NULL, NULL, '2024-07-16 02:47:34'),
	(13, 3, 'entregada', NULL, 'Calle Nostalgia Ultra', '21315887-2', 'foto_evidencia-1721098132841-748843064.jpg', '2024-07-16 02:48:53'),
	(14, 5, 'rechazada', 'Skibidi fortnite chamba', NULL, NULL, NULL, '2024-07-16 20:10:36'),
	(15, 5, 'por entregar', NULL, NULL, NULL, NULL, '2024-07-16 20:51:10'),
	(16, 5, 'rechazada', 'No salió nadie a recibirlo', NULL, NULL, NULL, '2024-07-16 20:51:29'),
	(17, 4, 'anulada', NULL, NULL, NULL, NULL, '2024-07-16 23:06:52');

CREATE TABLE IF NOT EXISTS `usuario` (
  `RUT` varchar(10) NOT NULL,
  `PASSWORD` varchar(45) NOT NULL,
  `RAZON_SOCIAL` varchar(80) NOT NULL,
  `DIRECCION` varchar(80) NOT NULL,
  `TELEFONO` int NOT NULL,
  `CORREO` varchar(50) NOT NULL,
  `SITIO_WEB` varchar(50) DEFAULT NULL,
  `TIPO_SERVICIO` varchar(80) DEFAULT NULL,
  PRIMARY KEY (`RUT`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

INSERT INTO `usuario` (`RUT`, `PASSWORD`, `RAZON_SOCIAL`, `DIRECCION`, `TELEFONO`, `CORREO`, `SITIO_WEB`, `TIPO_SERVICIO`) VALUES
	('75111227-3', 'yzysupplies123', 'YZY SUPPLIES S.A', 'Calle San Antonio 345', 765432765, 'yzysupplies@yzy.com', 'yzy.com', 'Venta de ropa'),
	('75113987-2', 'cactusjack123', 'Cactus Jack, S.A', 'Calle Travieso Salsa champiñon 1123', 954993355, 'cactusjacksacatus.com', 'https://shop.travisscott.com/', 'Venta de merch y cosas así idk'),
	('75122543-5', 'baltazarvinyl123', 'Baltazar Vinyl S.A', 'Av. Providencia 1120, local 64', 916553398, 'baltazarvinyl@gmail.com', 'https://baltazarvinyl.cl/', 'Venta de vinilos y cds'),
	('75432123-2', 'pass123', 'Whathedogduin', 'Calle Skibidi Sigma 123', 954993343, 'whathedogduin@gmail.com', 'whathedogduin.cl', 'Venta de comida de perros'),
	('75456765-2', 'yzymusic123', 'YZY MUSIC S.A LTDA', 'Pasaje Los Pehuenches 1547', 954993343, 'yzymusic@gmail.com', 'yzymusic.com', 'Venta de vinilos y cds');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
