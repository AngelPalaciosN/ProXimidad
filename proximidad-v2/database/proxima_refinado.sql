-- phpMyAdmin SQL Dump REFINADO
-- ProXimidad - Base de datos corregida con favoritos funcionales
-- Fecha: 30 de Septiembre, 2025

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `proxima`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_group`
--

CREATE TABLE `auth_group` (
  `id` int NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_group_permissions`
--

CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_permission`
--

CREATE TABLE `auth_permission` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `auth_permission`
--

INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES
(1, 'Can add log entry', 1, 'add_logentry'),
(2, 'Can change log entry', 1, 'change_logentry'),
(3, 'Can delete log entry', 1, 'delete_logentry'),
(4, 'Can view log entry', 1, 'view_logentry'),
(5, 'Can add permission', 2, 'add_permission'),
(6, 'Can change permission', 2, 'change_permission'),
(7, 'Can delete permission', 2, 'delete_permission'),
(8, 'Can view permission', 2, 'view_permission'),
(9, 'Can add group', 3, 'add_group'),
(10, 'Can change group', 3, 'change_group'),
(11, 'Can delete group', 3, 'delete_group'),
(12, 'Can view group', 3, 'view_group'),
(13, 'Can add user', 4, 'add_user'),
(14, 'Can change user', 4, 'change_user'),
(15, 'Can delete user', 4, 'delete_user'),
(16, 'Can view user', 4, 'view_user'),
(17, 'Can add content type', 5, 'add_contenttype'),
(18, 'Can change content type', 5, 'change_contenttype'),
(19, 'Can delete content type', 5, 'delete_contenttype'),
(20, 'Can view content type', 5, 'view_contenttype'),
(21, 'Can add session', 6, 'add_session'),
(22, 'Can change session', 6, 'change_session'),
(23, 'Can delete session', 6, 'delete_session'),
(24, 'Can view session', 6, 'view_session'),
(25, 'Can add categoria', 7, 'add_categoria'),
(26, 'Can change categoria', 7, 'change_categoria'),
(27, 'Can delete categoria', 7, 'delete_categoria'),
(28, 'Can view categoria', 7, 'view_categoria'),
(29, 'Can add usuario', 8, 'add_usuario'),
(30, 'Can change usuario', 8, 'change_usuario'),
(31, 'Can delete usuario', 8, 'delete_usuario'),
(32, 'Can view usuario', 8, 'view_usuario'),
(33, 'Can add servicios', 9, 'add_servicios'),
(34, 'Can change servicios', 9, 'change_servicios'),
(35, 'Can delete servicios', 9, 'delete_servicios'),
(36, 'Can view servicios', 9, 'view_servicios'),
(37, 'Can add comentarios', 10, 'add_comentarios'),
(38, 'Can change comentarios', 10, 'change_comentarios'),
(39, 'Can delete comentarios', 10, 'delete_comentarios'),
(40, 'Can view comentarios', 10, 'view_comentarios'),
(41, 'Can add favoritos', 11, 'add_favoritos'),
(42, 'Can change favoritos', 11, 'change_favoritos'),
(43, 'Can delete favoritos', 11, 'delete_favoritos'),
(44, 'Can view favoritos', 11, 'view_favoritos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_user`
--

CREATE TABLE `auth_user` (
  `id` int NOT NULL,
  `password` varchar(128) COLLATE utf8mb4_general_ci NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `first_name` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(254) COLLATE utf8mb4_general_ci NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_user_groups`
--

CREATE TABLE `auth_user_groups` (
  `id` bigint NOT NULL,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_user_user_permissions`
--

CREATE TABLE `auth_user_user_permissions` (
  `id` bigint NOT NULL,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `categoria_id` bigint NOT NULL,
  `nombre_categoria` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion_categoria` longtext COLLATE utf8mb4_general_ci,
  `icono` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `color` varchar(7) COLLATE utf8mb4_general_ci DEFAULT '#007bff',
  `orden` int UNSIGNED DEFAULT 0,
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`categoria_id`, `nombre_categoria`, `descripcion_categoria`, `icono`, `color`, `orden`, `activo`) VALUES
(1, 'Transporte', 'Servicios relacionados con el transporte de personas y mercancías.', 'fas fa-car', '#007bff', 1, 1),
(2, 'Aseo', 'Servicios de limpieza y mantenimiento de espacios.', 'fas fa-broom', '#28a745', 2, 1),
(3, 'Jardinería', 'Servicios de mantenimiento y diseño de jardines.', 'fas fa-leaf', '#20c997', 3, 1),
(4, 'Plomería', 'Servicios de reparación y mantenimiento de sistemas de plomería.', 'fas fa-wrench', '#fd7e14', 4, 1),
(5, 'Electricidad', 'Servicios eléctricos y de instalaciones eléctricas.', 'fas fa-bolt', '#ffc107', 5, 1),
(6, 'Carpintería', 'Servicios de carpintería y ebanistería.', 'fas fa-hammer', '#6f42c1', 6, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentarios`
--

CREATE TABLE `comentarios` (
  `comentario_id` bigint NOT NULL,
  `mensaje` longtext COLLATE utf8mb4_general_ci NOT NULL,
  `calificacion` int DEFAULT NULL,
  `fecha_creacion` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `activo` tinyint(1) DEFAULT 1,
  `servicio_fk` bigint NOT NULL,
  `usuario_fk` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `django_admin_log`
--

CREATE TABLE `django_admin_log` (
  `id` int NOT NULL,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext COLLATE utf8mb4_general_ci,
  `object_repr` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `action_flag` smallint UNSIGNED NOT NULL,
  `change_message` longtext COLLATE utf8mb4_general_ci NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `django_content_type`
--

CREATE TABLE `django_content_type` (
  `id` int NOT NULL,
  `app_label` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `model` varchar(100) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `django_content_type`
--

INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
(1, 'admin', 'logentry'),
(3, 'auth', 'group'),
(2, 'auth', 'permission'),
(4, 'auth', 'user'),
(5, 'contenttypes', 'contenttype'),
(7, 'proximidad_app', 'categoria'),
(10, 'proximidad_app', 'comentarios'),
(11, 'proximidad_app', 'favoritos'),
(9, 'proximidad_app', 'servicios'),
(8, 'proximidad_app', 'usuario'),
(6, 'sessions', 'session');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `django_migrations`
--

CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL,
  `app` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `applied` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `django_migrations`
--

INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
(1, 'contenttypes', '0001_initial', '2024-12-06 03:24:06.647765'),
(2, 'auth', '0001_initial', '2024-12-06 03:24:06.951344'),
(3, 'admin', '0001_initial', '2024-12-06 03:24:07.033360'),
(4, 'admin', '0002_logentry_remove_auto_add', '2024-12-06 03:24:07.048909'),
(5, 'admin', '0003_logentry_add_action_flag_choices', '2024-12-06 03:24:07.071896'),
(6, 'contenttypes', '0002_remove_content_type_name', '2024-12-06 03:24:07.193455'),
(7, 'auth', '0002_alter_permission_name_max_length', '2024-12-06 03:24:07.338186'),
(8, 'auth', '0003_alter_user_email_max_length', '2024-12-06 03:24:07.389574'),
(9, 'auth', '0004_alter_user_username_opts', '2024-12-06 03:24:07.520008'),
(10, 'auth', '0005_alter_user_last_login_null', '2024-12-06 03:24:07.590021'),
(11, 'auth', '0006_require_contenttypes_0002', '2024-12-06 03:24:07.592149'),
(12, 'auth', '0007_alter_validators_add_error_messages', '2024-12-06 03:24:07.608291'),
(13, 'auth', '0008_alter_user_username_max_length', '2024-12-06 03:24:07.669028'),
(14, 'auth', '0009_alter_user_last_name_max_length', '2024-12-06 03:24:07.726611'),
(15, 'auth', '0010_alter_group_name_max_length', '2024-12-06 03:24:07.764720'),
(16, 'auth', '0011_update_proxy_permissions', '2024-12-06 03:24:07.788509'),
(17, 'auth', '0012_alter_user_first_name_max_length', '2024-12-06 03:24:07.842424'),
(18, 'proximidad_app', '0001_initial', '2024-12-06 03:24:08.219625'),
(19, 'sessions', '0001_initial', '2024-12-06 03:24:08.263191');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `django_session`
--

CREATE TABLE `django_session` (
  `session_key` varchar(40) COLLATE utf8mb4_general_ci NOT NULL,
  `session_data` longtext COLLATE utf8mb4_general_ci NOT NULL,
  `expire_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura CORRECTA de tabla para la tabla `favoritos`
-- Actualizada para soportar favoritos de usuarios Y servicios
--

CREATE TABLE `favoritos` (
  `id` bigint NOT NULL,
  `usuario_id` bigint NOT NULL COMMENT 'Usuario que marca el favorito',
  `favorito_usuario` bigint DEFAULT NULL COMMENT 'Usuario marcado como favorito (NULL si es servicio)',
  `favorito_servicio` bigint DEFAULT NULL COMMENT 'Servicio marcado como favorito (NULL si es usuario)',
  `tipo_favorito` varchar(10) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'usuario' COMMENT 'Tipo: usuario o servicio',
  `fecha_agregado` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura ACTUALIZADA de tabla para la tabla `servicios`
--

CREATE TABLE `servicios` (
  `id` bigint NOT NULL,
  `nombre_servicio` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` longtext COLLATE utf8mb4_general_ci NOT NULL,
  `precio_base` decimal(10,2) NOT NULL,
  `imagen` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `categoria_id` bigint DEFAULT NULL,
  `proveedor_id` bigint DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `fecha_creacion` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `fecha_actualizacion` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `disponible` tinyint(1) DEFAULT 1,
  `ubicacion` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos MEJORADOS para la tabla `servicios`
--

INSERT INTO `servicios` (`id`, `nombre_servicio`, `descripcion`, `precio_base`, `imagen`, `categoria_id`, `proveedor_id`, `activo`, `fecha_creacion`, `fecha_actualizacion`, `disponible`, `ubicacion`) VALUES
(1, 'Transporte Urbano', 'Servicio de transporte confiable y seguro en la ciudad. Disponible 24/7.', 15000.00, 'servicios/transporte_urbano.jpg', 1, 1, 1, NOW(), NOW(), 1, 'Medellín, Antioquia'),
(2, 'Aseo Doméstico Premium', 'Servicio completo de aseo para hogares. Incluye limpieza profunda de todas las áreas.', 80000.00, 'servicios/aseo_domestico.jpg', 2, 2, 1, NOW(), NOW(), 1, 'Medellín, Antioquia'),
(3, 'Jardinería Profesional', 'Mantenimiento completo de jardines, poda de árboles y diseño paisajístico.', 120000.00, 'servicios/jardineria.jpg', 3, 3, 1, NOW(), NOW(), 1, 'Medellín, Antioquia'),
(4, 'Plomería 24 Horas', 'Servicio de emergencia en plomería. Reparaciones y mantenimiento.', 60000.00, 'servicios/plomeria.jpg', 4, 4, 1, NOW(), NOW(), 1, 'Medellín, Antioquia'),
(5, 'Instalaciones Eléctricas', 'Instalación y reparación de sistemas eléctricos residenciales y comerciales.', 90000.00, 'servicios/electricidad.jpg', 5, 5, 1, NOW(), NOW(), 1, 'Medellín, Antioquia');

-- --------------------------------------------------------

--
-- Estructura ACTUALIZADA de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` bigint NOT NULL,
  `nombre_completo` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `correo_electronico` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `telefono` varchar(15) COLLATE utf8mb4_general_ci NOT NULL,
  `direccion` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `cedula` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `codigo_verificacion` int NOT NULL,
  `tipo_usuario` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `imagen` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Foto de perfil (círculo)',
  `banner` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Banner de fondo del perfil',
  `fecha_registro` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `activo` tinyint(1) DEFAULT 1,
  `verificado` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos MEJORADOS para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `nombre_completo`, `correo_electronico`, `telefono`, `direccion`, `cedula`, `codigo_verificacion`, `tipo_usuario`, `imagen`, `fecha_registro`, `activo`, `verificado`) VALUES
(1, 'Angel David Palacios', 'palaciosangeldavidn@gmail.com', '3014365377', 'Calle 73 #46-69', '1023628818', 123456, 'proveedor', 'usuarios/487e2107-fed3-425a-86d5-2a819a2adffc.jpeg', NOW(), 1, 1),
(2, 'María García López', 'maria.garcia@gmail.com', '3012345678', 'Carrera 45 #32-18', '1025678901', 234567, 'proveedor', 'usuarios/5a392121-8d1a-44c1-872c-c92982d23360.jpg', NOW(), 1, 1),
(3, 'Juan Carlos Rodríguez', 'juan.rodriguez@gmail.com', '3023456789', 'Calle 80 #25-40', '1030987654', 345678, 'proveedor', 'usuarios/8aad2e6d-d4d1-4937-9fc5-a4b330247847.jpg', NOW(), 1, 1),
(4, 'Ana Sofía Martínez', 'ana.martinez@gmail.com', '3034567890', 'Carrera 70 #15-25', '1035432109', 456789, 'proveedor', 'usuarios/9637aa91-c39d-45c8-b915-6ff13ecfa3aa.jpg', NOW(), 1, 1),
(5, 'Carlos Eduardo Gómez', 'carlos.gomez@gmail.com', '3045678901', 'Calle 90 #55-30', '1040876543', 567890, 'proveedor', 'usuarios/993842d7-116f-4011-bbbc-46423b03db09.jpeg', NOW(), 1, 1),
(6, 'Laura Alejandra Sánchez', 'laura.sanchez@gmail.com', '3056789012', 'Carrera 85 #40-20', '1045321098', 678901, 'cliente', NULL, NOW(), 1, 1),
(7, 'Miguel Ángel Torres', 'miguel.torres@gmail.com', '3067890123', 'Calle 65 #30-15', '1050765432', 789012, 'cliente', NULL, NOW(), 1, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `auth_group`
--
ALTER TABLE `auth_group`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  ADD KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`);

--
-- Indices de la tabla `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`);

--
-- Indices de la tabla `auth_user`
--
ALTER TABLE `auth_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indices de la tabla `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  ADD KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`);

--
-- Indices de la tabla `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  ADD KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`);

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`categoria_id`),
  ADD KEY `categoria_nombre_categoria_idx` (`nombre_categoria`),
  ADD KEY `categoria_activo_orden_idx` (`activo`,`orden`);

--
-- Indices de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  ADD PRIMARY KEY (`comentario_id`),
  ADD KEY `comentarios_servicio_fk_af9736b6_fk_servicios_id` (`servicio_fk`),
  ADD KEY `comentarios_usuario_fk_9ba7d8e7_fk_usuario_id` (`usuario_fk`),
  ADD KEY `comentarios_fecha_creacion_idx` (`fecha_creacion`),
  ADD KEY `comentarios_calificacion_idx` (`calificacion`),
  ADD KEY `comentarios_activo_idx` (`activo`);

--
-- Indices de la tabla `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  ADD KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`);

--
-- Indices de la tabla `django_content_type`
--
ALTER TABLE `django_content_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`);

--
-- Indices de la tabla `django_migrations`
--
ALTER TABLE `django_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `django_session`
--
ALTER TABLE `django_session`
  ADD PRIMARY KEY (`session_key`),
  ADD KEY `django_session_expire_date_a5c62663` (`expire_date`);

--
-- Indices CORRECTOS de la tabla `favoritos`
--
ALTER TABLE `favoritos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `favoritos_usuario_favorito_usuario_unique` (`usuario_id`,`favorito_usuario`) USING BTREE COMMENT 'Evita duplicados usuario-usuario',
  ADD UNIQUE KEY `favoritos_usuario_favorito_servicio_unique` (`usuario_id`,`favorito_servicio`) USING BTREE COMMENT 'Evita duplicados usuario-servicio',
  ADD KEY `favoritos_usuario_id_idx` (`usuario_id`),
  ADD KEY `favoritos_favorito_usuario_idx` (`favorito_usuario`),
  ADD KEY `favoritos_favorito_servicio_idx` (`favorito_servicio`),
  ADD KEY `favoritos_tipo_favorito_idx` (`tipo_favorito`),
  ADD KEY `favoritos_fecha_agregado_idx` (`fecha_agregado`);

--
-- Indices de la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `servicios_categoria_id_ab82091d_fk_categoria_categoria_id` (`categoria_id`),
  ADD KEY `servicios_proveedor_id_611ef217_fk_usuario_id` (`proveedor_id`),
  ADD KEY `servicios_activo_idx` (`activo`),
  ADD KEY `servicios_disponible_idx` (`disponible`),
  ADD KEY `servicios_fecha_creacion_idx` (`fecha_creacion`),
  ADD KEY `servicios_nombre_servicio_idx` (`nombre_servicio`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo_electronico` (`correo_electronico`),
  ADD UNIQUE KEY `cedula` (`cedula`),
  ADD KEY `usuario_tipo_usuario_idx` (`tipo_usuario`),
  ADD KEY `usuario_activo_idx` (`activo`),
  ADD KEY `usuario_fecha_registro_idx` (`fecha_registro`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `auth_group`
--
ALTER TABLE `auth_group`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `auth_permission`
--
ALTER TABLE `auth_permission`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT de la tabla `auth_user`
--
ALTER TABLE `auth_user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `categoria_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  MODIFY `comentario_id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `django_admin_log`
--
ALTER TABLE `django_admin_log`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `django_content_type`
--
ALTER TABLE `django_content_type`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `django_migrations`
--
ALTER TABLE `django_migrations`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `favoritos`
--
ALTER TABLE `favoritos`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `servicios`
--
ALTER TABLE `servicios`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Restricciones para tablas volcadas CON CASCADAS CORRECTAS
--

--
-- Filtros para la tabla `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `comentarios`
--
ALTER TABLE `comentarios`
  ADD CONSTRAINT `comentarios_servicio_fk_af9736b6_fk_servicios_id` FOREIGN KEY (`servicio_fk`) REFERENCES `servicios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comentarios_usuario_fk_9ba7d8e7_fk_usuario_id` FOREIGN KEY (`usuario_fk`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`) ON DELETE CASCADE;

--
-- Filtros CORRECTOS para la tabla `favoritos`
--
ALTER TABLE `favoritos`
  ADD CONSTRAINT `favoritos_usuario_id_fk` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE COMMENT 'Usuario que marca favorito',
  ADD CONSTRAINT `favoritos_favorito_usuario_fk` FOREIGN KEY (`favorito_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE COMMENT 'Usuario marcado como favorito',
  ADD CONSTRAINT `favoritos_favorito_servicio_fk` FOREIGN KEY (`favorito_servicio`) REFERENCES `servicios` (`id`) ON DELETE CASCADE COMMENT 'Servicio marcado como favorito',
  ADD CONSTRAINT `favoritos_tipo_check` CHECK ((`tipo_favorito` in ('usuario','servicio'))),
  ADD CONSTRAINT `favoritos_logic_check` CHECK (((`tipo_favorito` = 'usuario' and `favorito_usuario` is not null and `favorito_servicio` is null) or (`tipo_favorito` = 'servicio' and `favorito_servicio` is not null and `favorito_usuario` is null)));

--
-- Filtros para la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD CONSTRAINT `servicios_categoria_id_ab82091d_fk_categoria_categoria_id` FOREIGN KEY (`categoria_id`) REFERENCES `categoria` (`categoria_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `servicios_proveedor_id_611ef217_fk_usuario_id` FOREIGN KEY (`proveedor_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;