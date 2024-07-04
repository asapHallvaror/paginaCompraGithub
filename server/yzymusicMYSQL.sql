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
  `estado_factura` enum('creada','rectificada') DEFAULT 'creada',
  `estado_entrega` varchar(50) DEFAULT 'por entregar',
  `motivo_rechazo` text,
  `direccion_entrega` varchar(255) DEFAULT NULL,
  `rut_receptor` varchar(255) DEFAULT NULL,
  `foto_evidencia` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`numero_orden`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf16;

INSERT INTO `facturas` (`numero_orden`, `fecha_orden`, `rut_proveedor`, `razon_social_proveedor`, `direccion_proveedor`, `telefono_proveedor`, `correo_proveedor`, `sitio_web_proveedor`, `tipo_servicio`, `rut_cliente`, `nombre_cliente`, `direccion_cliente`, `telefono_cliente`, `correo_cliente`, `subtotal`, `iva`, `total`, `productos`, `regionDespacho`, `comunaDespacho`, `direccionDespacho`, `fechaDespacho`, `estado_factura`, `estado_entrega`, `motivo_rechazo`, `direccion_entrega`, `rut_receptor`, `foto_evidencia`) VALUES
	(1, '2024-07-03', '75456765-2', 'YZY MUSIC S.A LTDA', 'Pasaje Los Pehuenches 1547', '954993343', 'yzymusic@gmail.com', 'yzymusic.com', 'Venta de vinilos y cds', '2131555555', 'Kanye', 'Calle Papel Verde 345', '965432134', 'alan.gajardo@gmail.com', 43960, 8352, 52312, '[{"total": "43960", "nombre": "Album Staydom STAYC", "precio": "10990", "cantidad": "4"}]', 'Región Metropolitana', 'Puente Alto', 'Calle Papel Verde 345', '2024-07-10', NULL, NULL, NULL, NULL, NULL, NULL),
	(2, '2024-07-03', '75456765-2', 'YZY MUSIC S.A LTDA', 'Pasaje Los Pehuenches 1547', '954993343', 'yzymusic@gmail.com', 'yzymusic.com', 'Venta de vinilos y cds', '2131555555', 'Kanye', 'Calle Papel Verde 345', '965432134', 'alan.gajardo@gmail.com', 20000, 3800, 20380, '[{"total": 20000, "nombre": "Album Staydom STAYC", "precio": "10000", "cantidad": "2"}]', 'Región Metropolitana', 'Puente Alto', 'Calle Papel Verde 345', '2024-07-10', NULL, 'por entregar', NULL, NULL, NULL, NULL),
	(3, '2024-07-03', '75456765-2', 'YZY MUSIC S.A LTDA', 'Pasaje Los Pehuenches 1547', '954993343', 'yzymusic@gmail.com', 'yzymusic.com', 'Venta de vinilos y cds', '2131555555', 'Joseph Curry', 'Calle Papel Verde 345', '965432134', 'alan.gajardo@gmail.com', 21980, 4176, 26156, '[{"total": "21980", "nombre": "Album Staydom STAYC", "precio": "10990", "cantidad": "2"}]', 'Región Metropolitana', 'Puente Alto', 'Calle Papel Verde 345', '2024-07-10', NULL, 'rechazada', 'No estaba en casa', NULL, NULL, NULL),
	(4, '2024-07-03', '75456765-2', 'YZY MUSIC S.A LTDA', 'Pasaje Los Pehuenches 1547', '954993343', 'yzymusic@gmail.com', 'yzymusic.com', 'Venta de vinilos y cds', '2131555555', 'Kanye', 'Calle Papel Verde 345', '965432134', 'alan.gajardo@gmail.com', 20000, 3800, 20380, '[{"total": 20000, "nombre": "Album Staydom STAYC", "precio": "10000", "cantidad": "2"}]', 'Región Metropolitana', 'Puente Alto', 'Calle Papel Verde 345', '2024-07-10', NULL, 'por entregar', NULL, NULL, NULL, NULL),
	(5, '2024-07-03', '75456765-2', 'YZY MUSIC S.A LTDA', 'Pasaje Los Pehuenches 1547', '954993343', 'yzymusic@gmail.com', 'yzymusic.com', 'Venta de vinilos y cds', '2131555555', 'Kanye', 'Calle Papel Verde 345', '965432134', 'alan.gajardo@gmail.com', 219800, 41762, 219800, '[{"total": 219800, "nombre": "Album Staydom STAYC", "precio": "10990", "cantidad": "20"}]', 'Región Metropolitana', 'Puente Alto', 'Calle Papel Verde 345', '2024-07-17', NULL, 'entregada', '', 'sdfas', '21315887-2', NULL),
	(6, '2024-07-03', '75456765-2', 'YZY MUSIC S.A LTDA', 'Pasaje Los Pehuenches 1547', '954993343', 'yzymusic@gmail.com', 'yzymusic.com', 'Venta de vinilos y cds', '2131555555', 'Kanye', 'Calle Papel Verde 345', '965432134', 'alan.gajardo@gmail.com', 109900, 20881, 111988, '[{"total": 109900, "nombre": "Album Staydom STAYC", "precio": "10990", "cantidad": "10"}]', 'Región Metropolitana', 'Puente Alto', 'Calle Papel Verde 345', '2024-07-10', 'creada', 'entregada', '', 'Calle hola chavales 123', '21315887-2', 'foto_evidencia-1720052993609-724889080.jpg'),
	(7, '2024-07-03', '75456765-2', 'YZY MUSIC S.A LTDA', 'Pasaje Los Pehuenches 1547', '954993343', 'yzymusic@gmail.com', 'yzymusic.com', 'Venta de vinilos y cds', '2131555555', 'Kanye', 'Calle Papel Verde 345', '965432134', 'alan.gajardo@gmail.com', 5970, 1134, 7104, '[{"total": "5970", "nombre": "Album Staydom STAYC", "precio": "1990", "cantidad": "3"}]', 'Región Metropolitana', 'Puente Alto', 'Calle Papel Verde 345', '2024-07-18', 'rectificada', 'entregada', '', 'sdfas', '21315887-2', 'foto_evidencia-1720046971043-99734817.jpg'),
	(8, '2024-07-03', '75456765-2', 'YZY MUSIC S.A LTDA', 'Pasaje Los Pehuenches 1547', '954993343', 'yzymusic@gmail.com', 'yzymusic.com', 'Venta de vinilos y cds', '2131555555', 'Kanye', 'Calle Papel Verde 345', '965432134', 'alan.gajardo@gmail.com', 179700, 34143, 183114, '[{"total": 179700, "nombre": "CD YEEZUS", "precio": "5990", "cantidad": "30"}]', 'Región Metropolitana', 'Puente Alto', 'Calle Papel Verde 345', '2024-07-10', 'creada', 'entregada', '', 'Calle hola chavales 123', '21315887-2', 'foto_evidencia-1720055627687-814010242.jpg'),
	(9, '2024-07-03', '75456765-2', 'YZY MUSIC S.A LTDA', 'Pasaje Los Pehuenches 1547', '954993343', 'yzymusic@gmail.com', 'yzymusic.com', 'Venta de vinilos y cds', '2131555555', 'Kanye', 'Calle Papel Verde 345', '965432134', 'alan.gajardo@gmail.com', 20900, 3971, 21297, '[{"total": 20900, "nombre": "CD YEEZUS", "precio": "100", "cantidad": "209"}]', 'Región Metropolitana', 'Puente Alto', 'Calle Papel Verde 345', '2024-07-24', 'creada', 'entregada', '', 'Calle hola chavales 123', '21315887-2', 'foto_evidencia-1720059752898-451815378.jpg'),
	(10, '2024-07-10', '75456765-2', 'YZY MUSIC S.A LTDA', 'Pasaje Los Pehuenches 1547', '954993343', 'yzymusic@gmail.com', 'yzymusic.com', 'Venta de vinilos y cds', '2131555555', 'Alan Frijol', 'Calle Papel Verde 345', '965432134', 'alan.gajardo@gmail.com', 99900, 18981, 118881, '[{"total": "99900", "nombre": "CD YEEZUS", "precio": "9990", "cantidad": "10"}]', 'Región Metropolitana', 'Puente Alto', 'Calle Papel Verde 345', '2024-07-10', 'rectificada', 'entregada', '', 'Calle skibidi sigma 12', '23456789-2', NULL),
	(11, '2024-07-11', '75456765-2', 'YZY MUSIC S.A LTDA', 'Pasaje Los Pehuenches 1547', '954993343', 'yzymusic@gmail.com', 'yzymusic.com', 'Venta de vinilos y cds', '2131555555', 'Jose Antonioo', 'Calle Papel Verde 345', '965432134', 'alan.gajardo@gmail.com', 49950, 9491, 59441, '[{"total": "49950", "nombre": "CD YEEZUS", "precio": "9990", "cantidad": "5"}]', 'Región Metropolitana', 'Puente Alto', 'Calle Papel Verde 345', '2024-07-11', 'rectificada', 'entregada', NULL, 'Calle Papel Verde 345', '23456789-2', 'foto_evidencia-1720066674420-485221986.jpeg');

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
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf16;

INSERT INTO `historial_facturas` (`id`, `numero_orden`, `estado_nuevo`, `motivo_rechazo`, `direccion_entrega`, `rut_receptor`, `foto_evidencia`, `fecha_cambio`) VALUES
	(1, 6, 'rechazada', 'skibidi lol', NULL, NULL, NULL, '2024-07-03 22:12:27'),
	(2, 6, 'rechazada', 'saddsfdsd', '', '', NULL, '2024-07-03 22:20:03'),
	(3, 6, 'entregada', 'saddsfdsd', 'Calle hola chavales 123', '21315887-2', NULL, '2024-07-03 22:20:21'),
	(4, 7, 'rechazada', 'No lo quiso recibir', '', '', NULL, '2024-07-03 22:26:10'),
	(5, 7, 'entregada', '', 'Calle hola chavales 123', '21315887-2', 'foto_evidencia-1720046088404-512365509.jpeg', '2024-07-03 22:34:48'),
	(6, 7, 'entregada', '', 'Calle hola chavales 123', '21315887-2', 'foto_evidencia-1720046348377-806691604.jpeg', '2024-07-03 22:39:08'),
	(7, 7, 'entregada', '', 'sdfas', '21315887-2', 'foto_evidencia-1720046493437-658128880.jpg', '2024-07-03 22:41:33'),
	(8, 7, 'entregada', '', 'sdfas', '21315887-2', 'foto_evidencia-1720046939455-301769402.jpg', '2024-07-03 22:48:59'),
	(9, 7, 'entregada', '', 'sdfas', '21315887-2', 'foto_evidencia-1720046971043-99734817.jpg', '2024-07-03 22:49:31'),
	(10, 5, 'entregada', '', 'sdfas', '21315887-2', NULL, '2024-07-04 00:15:57'),
	(11, 6, 'entregada', '', 'Calle hola chavales 123', '21315887-2', 'foto_evidencia-1720052993609-724889080.jpg', '2024-07-04 00:29:54'),
	(12, 8, 'entregada', '', 'Calle hola chavales 123', '21315887-2', 'foto_evidencia-1720055627687-814010242.jpg', '2024-07-04 01:13:48'),
	(13, 9, 'entregada', '', 'Calle hola chavales 123', '21315887-2', 'foto_evidencia-1720059752898-451815378.jpg', '2024-07-04 02:22:33'),
	(14, 10, 'entregada', '', 'Los Pehuenches #1547', '21315887-2', 'foto_evidencia-1720060495793-247477366.png', '2024-07-04 02:34:56'),
	(15, 10, 'rectificada', '', '', '', NULL, '2024-07-04 03:12:49'),
	(16, 10, 'rectificada', '', '', '', NULL, '2024-07-04 03:16:26'),
	(17, 10, 'rectificada', '', '', '', NULL, '2024-07-04 03:20:45'),
	(18, 10, 'entregada', '', 'Calle skibidi sigma 12', '23456789-2', NULL, '2024-07-04 03:22:42'),
	(19, 11, 'rechazada', 'No quiso recibirlo y ofrecio combo', '', '', NULL, '2024-07-04 04:07:39'),
	(20, 11, 'entregada', '', 'Los Pehuenches #1547', '21315887-2', 'foto_evidencia-1720066108684-254169845.jpg', '2024-07-04 04:08:29'),
	(21, 3, 'rechazada', 'No quiso recibirlo', '', '', NULL, '2024-07-04 04:08:56'),
	(22, 11, 'rechazada', ' No quiso recibirlo Lol', NULL, NULL, NULL, '2024-07-04 04:17:30'),
	(23, 11, 'entregada', NULL, 'Calle Papel Verde 345', '23456789-2', 'foto_evidencia-1720066674420-485221986.jpeg', '2024-07-04 04:17:54'),
	(24, 3, 'rechazada', 'No estaba en casa', NULL, NULL, NULL, '2024-07-04 04:24:38');


/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
