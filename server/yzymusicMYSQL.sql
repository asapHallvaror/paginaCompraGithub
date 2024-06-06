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
  PRIMARY KEY (`numero_orden`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf16;

INSERT INTO `facturas` (`numero_orden`, `fecha_orden`, `rut_proveedor`, `razon_social_proveedor`, `direccion_proveedor`, `telefono_proveedor`, `correo_proveedor`, `sitio_web_proveedor`, `tipo_servicio`, `rut_cliente`, `nombre_cliente`, `direccion_cliente`, `telefono_cliente`, `correo_cliente`, `subtotal`, `iva`, `total`, `productos`) VALUES
	(1, '2024-06-05', '75111227-3', 'YZY SUPPLIES S.A', 'Calle San Antonio 345', '765432765', 'yzysupplies@yzy.com', 'yzy.com', 'Venta de ropa', '21315887-2', 'Lebron James', 'Calle LOOLLLL 123', '976545678', 'freakyphone@gmail.com', 199800, 37962, 203596, '[{"total": 199800, "nombre": "CD MR MORALE KEN LAM", "precio": "9990", "cantidad": "20"}]'),
	(2, '2024-06-05', '75111227-3', 'YZY SUPPLIES S.A', 'Calle San Antonio 345', '765432765', 'yzysupplies@yzy.com', 'yzy.com', 'Venta de ropa', '21315887-2', 'Lebron James', 'Calle LOOLLLL 123', '976545678', 'freakyphone@gmail.com', 239750, 45553, 271631, '[{"total": 99900, "nombre": "CD MR MORALE KEN LAM", "precio": "9990", "cantidad": "10"}, {"total": 59900, "nombre": "CD YEEZUS", "precio": "5990", "cantidad": "10"}, {"total": 79950, "nombre": "Peluche Hello Kitty Bee", "precio": "15990", "cantidad": "5"}]'),
	(3, '2024-06-06', '75111227-3', 'YZY SUPPLIES S.A', 'Calle San Antonio 345', '765432765', 'yzysupplies@yzy.com', 'yzy.com', 'Venta de ropa', '21315887-2', 'Álvaro Morales', 'Los Pehuenches #1547', '954993343', 'alvaromorales@gmail.com', 864600, 164274, 1010928, '[{"total": 59900, "nombre": "CD VULTURES 2", "precio": "5990", "cantidad": "10"}, {"total": 619800, "nombre": "VINILO RODEO", "precio": "30990", "cantidad": "20"}, {"total": 79950, "nombre": "ALBUM STAYDOM STAYC", "precio": "15990", "cantidad": "5"}, {"total": 104950, "nombre": "ALBUM TWICECOASTER LINE 1", "precio": "20990", "cantidad": "5"}]');

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
	('75122543-5', 'baltazarvinyl123', 'Baltazar Vinyl S.A', 'Av. Providencia 1120, local 64', 916553398, 'baltazarvinyl@gmail.com', 'https://baltazarvinyl.cl/', 'Venta de vinilos y cds');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
