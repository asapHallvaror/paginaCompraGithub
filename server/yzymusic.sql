USE [yzymusic]
GO
/****** Object:  Table [dbo].[detalle_factura]    Script Date: 6/18/2025 9:53:41 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[detalle_factura](
	[id_detalle] [int] IDENTITY(1,1) NOT NULL,
	[numero_orden] [int] NOT NULL,
	[nombre_producto] [varchar](255) NOT NULL,
	[precio_unitario] [int] NOT NULL,
	[cantidad] [int] NOT NULL,
	[total] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id_detalle] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[facturas]    Script Date: 6/18/2025 9:53:41 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[facturas](
	[numero_orden] [int] IDENTITY(1,1) NOT NULL,
	[fecha_orden] [date] NULL,
	[rut_proveedor] [varchar](255) NULL,
	[razon_social_proveedor] [varchar](255) NULL,
	[direccion_proveedor] [varchar](255) NULL,
	[telefono_proveedor] [varchar](15) NULL,
	[correo_proveedor] [varchar](255) NULL,
	[sitio_web_proveedor] [varchar](255) NULL,
	[tipo_servicio] [varchar](255) NULL,
	[rut_cliente] [varchar](255) NULL,
	[nombre_cliente] [varchar](255) NULL,
	[direccion_cliente] [varchar](255) NULL,
	[telefono_cliente] [varchar](15) NULL,
	[correo_cliente] [varchar](255) NULL,
	[subtotal] [int] NULL,
	[iva] [int] NULL,
	[total] [int] NULL,
	[regionDespacho] [varchar](90) NULL,
	[comunaDespacho] [varchar](90) NULL,
	[direccionDespacho] [varchar](90) NULL,
	[fechaDespacho] [date] NULL,
	[estado_factura] [varchar](20) NULL,
	[estado_entrega] [varchar](50) NULL,
	[motivo_rechazo] [varchar](max) NULL,
	[direccion_entrega] [varchar](255) NULL,
	[rut_receptor] [varchar](255) NULL,
	[foto_evidencia] [varchar](255) NULL,
	[eliminada] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[numero_orden] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[historial_facturas]    Script Date: 6/18/2025 9:53:41 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[historial_facturas](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[numero_orden] [int] NULL,
	[estado_nuevo] [varchar](50) NULL,
	[motivo_rechazo] [varchar](max) NULL,
	[direccion_entrega] [varchar](255) NULL,
	[rut_receptor] [varchar](255) NULL,
	[foto_evidencia] [varchar](255) NULL,
	[fecha_cambio] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[trigger_logs]    Script Date: 6/18/2025 9:53:41 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[trigger_logs](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[numero_orden] [int] NULL,
	[mensaje] [varchar](255) NULL,
	[fecha] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[usuario]    Script Date: 6/18/2025 9:53:41 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[usuario](
	[RUT] [varchar](10) NOT NULL,
	[PASSWORD] [varchar](45) NOT NULL,
	[RAZON_SOCIAL] [varchar](80) NOT NULL,
	[DIRECCION] [varchar](80) NOT NULL,
	[TELEFONO] [int] NOT NULL,
	[CORREO] [varchar](50) NOT NULL,
	[SITIO_WEB] [varchar](50) NULL,
	[TIPO_SERVICIO] [varchar](80) NULL,
PRIMARY KEY CLUSTERED 
(
	[RUT] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[facturas] ADD  DEFAULT ('creada') FOR [estado_factura]
GO
ALTER TABLE [dbo].[facturas] ADD  DEFAULT ('por entregar') FOR [estado_entrega]
GO
ALTER TABLE [dbo].[facturas] ADD  DEFAULT ((0)) FOR [eliminada]
GO
ALTER TABLE [dbo].[historial_facturas] ADD  DEFAULT (getdate()) FOR [fecha_cambio]
GO
ALTER TABLE [dbo].[trigger_logs] ADD  DEFAULT (getdate()) FOR [fecha]
GO
ALTER TABLE [dbo].[detalle_factura]  WITH CHECK ADD FOREIGN KEY([numero_orden])
REFERENCES [dbo].[facturas] ([numero_orden])
GO
ALTER TABLE [dbo].[historial_facturas]  WITH CHECK ADD FOREIGN KEY([numero_orden])
REFERENCES [dbo].[facturas] ([numero_orden])
GO
-- Inserción de usuarios en la tabla 'usuario'
INSERT INTO usuario (RUT, PASSWORD, RAZON_SOCIAL, DIRECCION, TELEFONO, CORREO, SITIO_WEB, TIPO_SERVICIO) VALUES
('75111227-3', 'yzysupplies123', 'YZY SUPPLIES S.A', 'Calle San Antonio 345', 765432765, 'yzysupplies@yzy.com', 'yzy.com', 'Venta de ropa'),
('75113987-2', 'cactusjack123', 'Cactus Jack, S.A', 'Calle Travieso Salsa champiñon 1123', 954993355, 'cactusjacksacatus.com', 'https://shop.travisscott.com/', 'Venta de merch y cosas así idk'),
('75122543-5', 'baltazarvinyl123', 'Baltazar Vinyl S.A', 'Av. Providencia 1120, local 64', 916553398, 'baltazarvinyl@gmail.com', 'https://baltazarvinyl.cl/', 'Venta de vinilos y cds'),
('75432123-2', 'pass123', 'Whathedogduin', 'Calle Skibidi Sigma 123', 954993343, 'whathedogduin@gmail.com', 'whathedogduin.cl', 'Venta de comida de perros'),
('75456765-2', 'yzymusic123', 'YZY MUSIC S.A LTDA', 'Pasaje Los Pehuenches 1547', 954993343, 'yzymusic@gmail.com', 'yzymusic.com', 'Venta de vinilos y cds');
