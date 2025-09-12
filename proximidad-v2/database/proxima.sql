-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 09, 2025 at 01:57 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.16

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
-- Table structure for table `auth_group`
--

CREATE TABLE `auth_group` (
  `id` int NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_group_permissions`
--

CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_permission`
--

CREATE TABLE `auth_permission` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auth_permission`
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
(33, 'Can add servicio', 9, 'add_servicio'),
(34, 'Can change servicio', 9, 'change_servicio'),
(35, 'Can delete servicio', 9, 'delete_servicio'),
(36, 'Can view servicio', 9, 'view_servicio'),
(37, 'Can add comentario', 10, 'add_comentario'),
(38, 'Can change comentario', 10, 'change_comentario'),
(39, 'Can delete comentario', 10, 'delete_comentario'),
(40, 'Can view comentario', 10, 'view_comentario'),
(41, 'Can add favorito', 11, 'add_favorito'),
(42, 'Can change favorito', 11, 'change_favorito'),
(43, 'Can delete favorito', 11, 'delete_favorito'),
(44, 'Can view favorito', 11, 'view_favorito');

-- --------------------------------------------------------

--
-- Table structure for table `auth_user`
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

--
-- Dumping data for table `auth_user`
--

INSERT INTO `auth_user` (`id`, `password`, `last_login`, `is_superuser`, `username`, `first_name`, `last_name`, `email`, `is_staff`, `is_active`, `date_joined`) VALUES
(1, 'pbkdf2_sha256$720000$eNd4H5Y75c16KoeSSSkUjy$x1kyg+gtmZGah6KmdQ2/sqaupQOv6wJIugZN6mOvLog=', NULL, 0, 'prueba', '', '', 'prueba@gmail.com', 0, 1, '2025-05-09 00:23:32.508647'),
(2, 'pbkdf2_sha256$720000$NYBqdjnmvmHormToWESLYv$q1wCEJINu6lZ12GTn5x5t9Aw8xzH5BRxzlxFK7NyY5M=', NULL, 0, 'prueba2', '', '', 'prueba2@gmail.com', 0, 1, '2025-05-09 00:26:52.501444'),
(3, 'pbkdf2_sha256$720000$i42eG7hsEPSRVy7nZ6cmr5$JMFBY4pLEmYHtSfv9MHnsU1fenbFu0hfzfd9h72K4jU=', NULL, 0, 'pruebarr', '', '', 'pruebarr@gmail.com', 0, 1, '2025-05-09 00:41:51.881995'),
(5, 'pbkdf2_sha256$720000$SmpKX5NO5TfJmUwlaKAAhV$plqOfkIE3iWmO/EbwqYlHk0U+qsirV3hxzOxc3NrSf0=', NULL, 0, 'pruebat', '', '', 'pruebat@gmail.com', 0, 1, '2025-05-09 00:54:36.225681'),
(6, 'pbkdf2_sha256$720000$4QrJxtYxSEhsonPTI188Bk$x/cKoYi93ce3Tug5178E1CNFjcocHMOC2tXc14m21B0=', NULL, 0, 'brandonadrian707', '', '', 'brandonadrian707@gmail.com', 0, 1, '2025-05-09 00:56:44.675470'),
(7, 'pbkdf2_sha256$720000$cPuGovDgwyMyNfUnSHfQE8$Eiun1Vr9B7FNmBxsath0Lx9bL/sIU10a/go5E7t+cGo=', NULL, 0, 'pruebaz', '', '', 'pruebaz@gmail.com', 0, 1, '2025-05-09 00:58:01.929674'),
(8, 'pbkdf2_sha256$720000$kIraByz4Izr2sWMoAac0J9$dt9KTD/qu2zZPNMs8FIKLHNL8gzKafe7IGdSDj4TPxo=', NULL, 0, 'pruebari', '', '', 'pruebari@gmail.com', 0, 1, '2025-05-09 01:07:42.819811'),
(9, 'pbkdf2_sha256$720000$YNdwP79JRud1r7oTl9aMXG$Zyd3x153bMCzsg1HIW7UUca6VDVefcynl3e+Y9nfS9Y=', NULL, 0, 'user_7973', '', '', '', 0, 1, '2025-05-09 01:11:19.958714'),
(12, 'pbkdf2_sha256$720000$VSmuzdNwWWzymjRXSpV4i3$kGLWk12ID2eMzvkwsgPIF3Hg0SD9UHFGwqhnJZRmqzM=', NULL, 0, 'pruebaa', '', '', 'pruebaa@gmail.com', 0, 1, '2025-05-09 01:14:28.006485'),
(13, 'pbkdf2_sha256$720000$P7flzBMbY0QIGxWgqZCuRR$2hxhMXw1xDl81xRLk7I0pqxHmsNdPQQK6o6iuaIsBsI=', NULL, 0, 'pruebaaff', '', '', 'pruebaaff@gmail.com', 0, 1, '2025-05-09 01:15:22.504088'),
(14, 'pbkdf2_sha256$720000$9mwAxydrqPVzDzo6b9rvrG$iB3tljQnr8HQANbVUUkIqi9FJg6hflOG0O5oumpxt4k=', NULL, 0, 'prue@gmail.com', 'pruebath', '', 'prue@gmail.com', 0, 1, '2025-05-09 01:34:31.817897'),
(15, 'pbkdf2_sha256$720000$3hL4Epi88CTERJT2OW1jNL$2/wZksvvVO/ovdxETFIBeyOk0+tiqaNl7QsVa5HH61I=', NULL, 0, 'Workspacealan02@gmail.com', 'Alan Vergoglio', '', 'Workspacealan02@gmail.com', 0, 1, '2025-05-09 01:46:21.501397');

-- --------------------------------------------------------

--
-- Table structure for table `auth_user_groups`
--

CREATE TABLE `auth_user_groups` (
  `id` bigint NOT NULL,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_user_user_permissions`
--

CREATE TABLE `auth_user_user_permissions` (
  `id` bigint NOT NULL,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categoria`
--

CREATE TABLE `categoria` (
  `categoria_id` bigint NOT NULL,
  `nombre_categoria` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion_categoria` longtext COLLATE utf8mb4_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categoria`
--

INSERT INTO `categoria` (`categoria_id`, `nombre_categoria`, `descripcion_categoria`) VALUES
(1, 'Transporte', 'Servicios relacionados con el transporte de personas y mercancías.'),
(2, 'Aseo', 'Servicios de limpieza y mantenimiento de espacios.'),
(3, 'Jardinería', 'Servicios de mantenimiento y diseño de jardines.'),
(4, 'Plomería', 'Servicios de reparación y mantenimiento de sistemas de plomería.');

-- --------------------------------------------------------

--
-- Table structure for table `comentarios`
--

CREATE TABLE `comentarios` (
  `comentario_id` bigint NOT NULL,
  `mensaje` longtext COLLATE utf8mb4_general_ci NOT NULL,
  `servicio_fk` bigint NOT NULL,
  `usuario_fk` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comentarios`
--

INSERT INTO `comentarios` (`comentario_id`, `mensaje`, `servicio_fk`, `usuario_fk`) VALUES
(1, 'sa', 5, 1);

-- --------------------------------------------------------

--
-- Table structure for table `django_admin_log`
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
) ;

-- --------------------------------------------------------

--
-- Table structure for table `django_content_type`
--

CREATE TABLE `django_content_type` (
  `id` int NOT NULL,
  `app_label` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `model` varchar(100) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `django_content_type`
--

INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
(1, 'admin', 'logentry'),
(3, 'auth', 'group'),
(2, 'auth', 'permission'),
(4, 'auth', 'user'),
(5, 'contenttypes', 'contenttype'),
(7, 'proX', 'categoria'),
(10, 'proX', 'comentario'),
(11, 'proX', 'favorito'),
(9, 'proX', 'servicio'),
(8, 'proX', 'usuario'),
(6, 'sessions', 'session');

-- --------------------------------------------------------

--
-- Table structure for table `django_migrations`
--

CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL,
  `app` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `applied` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `django_migrations`
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
(18, 'proX', '0001_initial', '2024-12-06 03:24:08.219625'),
(19, 'sessions', '0001_initial', '2024-12-06 03:24:08.263191');

-- --------------------------------------------------------

--
-- Table structure for table `django_session`
--

CREATE TABLE `django_session` (
  `session_key` varchar(40) COLLATE utf8mb4_general_ci NOT NULL,
  `session_data` longtext COLLATE utf8mb4_general_ci NOT NULL,
  `expire_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `favoritos`
--

CREATE TABLE `favoritos` (
  `id` bigint NOT NULL,
  `favorito_id` bigint NOT NULL,
  `usuario_id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `favoritos`
--

INSERT INTO `favoritos` (`id`, `favorito_id`, `usuario_id`) VALUES
(2, 19, 12);

-- --------------------------------------------------------

--
-- Table structure for table `servicios`
--

CREATE TABLE `servicios` (
  `id` bigint NOT NULL,
  `nombre_servicio` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` longtext COLLATE utf8mb4_general_ci NOT NULL,
  `precio_base` decimal(10,2) NOT NULL,
  `imagen_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `categoria_id` bigint DEFAULT NULL,
  `proveedor_id` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `servicios`
--

INSERT INTO `servicios` (`id`, `nombre_servicio`, `descripcion`, `precio_base`, `imagen_url`, `categoria_id`, `proveedor_id`) VALUES
(5, 'Transporte Público', 'Servicio de transporte público en la ciudad.', 30000.00, 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.tiktok.com%2Fdiscover%2Fbuses-de-medell%25C3%25ADn&psig=AOvVaw1cqWYBSQ71tcs9LjH85HkW&ust=1733449891149000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKj7npvCj4oDFQAAAAAdAAAAABAR', 1, 1),
(6, 'Aseo Doméstico', 'Servicio de aseo y limpieza para hogares.', 25000.00, 'https://www.google.com/imgres?q=servicio%20limpieza%20imagen%20hd&imgurl=https%3A%2F%2Fst3.depositphotos.com%2F1194063%2F19051%2Fi%2F450%2Fdepositphotos_190518090-stock-photo-cleaning-concept-housecleaning-hygiene-spring.jpg&imgrefurl=https%3A%2F%2Fdeposi', 2, 1),
(7, 'Jardinería Básica', 'Servicio de mantenimiento básico de jardines.', 20000.00, 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pexels.com%2Fes-es%2Fbuscar%2Fjardines%2F&psig=AOvVaw3NIFbCuD0syMrMHeQPTv_u&ust=1733450033619000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCIC62ejCj4oDFQAAAAAdAAAAABAV', 3, 3),
(8, 'Plomería Básica', 'Servicio de reparaciones básicas de plomería.', 15000.00, 'https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fes%2Fs%2Ffotos%2Fplomer%25C3%25ADa&psig=AOvVaw1dDQ6r53NRNIsfxJnpwN93&ust=1733450140416000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKC5vJHDj4oDFQAAAAAdAAAAABAE', 4, 3);

-- --------------------------------------------------------

--
-- Table structure for table `usuario`
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
  `imagen` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuario`
--

INSERT INTO `usuario` (`id`, `nombre_completo`, `correo_electronico`, `telefono`, `direccion`, `cedula`, `codigo_verificacion`, `tipo_usuario`, `imagen`) VALUES
(1, 'Angel David', 'palaciosangeldavidn@gmail.com', '3014365377', 'CL 73 # 46 - 69', '1023628818', 123, 'proveedor', NULL),
(3, 'Juan jose cardenas', 'j@gmail.com', '6042338188', 'CL 73 # 46 - 69', '1023628816', 123, 'proveedor', NULL),
(4, 'John jairo', 'mario.gonzalez@example.com', '3014365377', 'CL 73 # 46 - 69', '7168066066', 775892, 'arrendador', NULL),
(5, 'prueba', 'prueba@gmail.com', '3014365377', 'Calle 73 #46-69', '1023628818', 492608, 'proveedor', ''),
(6, 'pruebar', 'prueba2@gmail.com', '3014365377', 'Calle 73 #46-69', '1023698818', 144948, 'proveedor', ''),
(7, 'pruebarr', 'pruebarr@gmail.com', '3014365377', 'Calle 73 #46-69', '1056288185', 509825, 'proveedor', ''),
(9, 'pruebarrr', 'pruebat@gmail.com', '2312312312', 'Calle 73 #56-76', '1231231235', 966833, 'proveedor', ''),
(10, 'pruebarrrr', 'brandonadrian707@gmail.com', '2131231231', 'Calle 73 #46-69', '1231231231', 257785, 'proveedor', ''),
(11, 'pruebarrrr', 'pruebaz@gmail.com', '2131232312', 'Calle 73 #46-69', '1231231231', 249467, 'proveedor', ''),
(12, 'pruebarrrt', 'pruebari@gmail.com', '1231231232', '324324', '2343243244', 693770, 'proveedor', ''),
(16, 'pruebaa', 'pruebaa@gmail.com', '3432432434', '13123', '1231231231', 614317, 'proveedor', ''),
(17, 'pruebaaff', 'pruebaaff@gmail.com', '3432432434', '13123', '1231231231', 350928, 'proveedor', ''),
(18, 'pruebath', 'prue@gmail.com', '1231231233', '12312', '2312312312', 389426, 'proveedor', 'usuarios/down-4_Mbd7s3p.jpg'),
(19, 'Alan Vergoglio', 'Workspacealan02@gmail.com', '1223456789', 'Calle 100C Sur # 48 C 33', '1036602639', 993098, 'proveedor', 'usuarios/Alan_Toro_Prime.jpeg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `auth_group`
--
ALTER TABLE `auth_group`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  ADD KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`);

--
-- Indexes for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`);

--
-- Indexes for table `auth_user`
--
ALTER TABLE `auth_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  ADD KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`);

--
-- Indexes for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  ADD KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`);

--
-- Indexes for table `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`categoria_id`);

--
-- Indexes for table `comentarios`
--
ALTER TABLE `comentarios`
  ADD PRIMARY KEY (`comentario_id`),
  ADD KEY `comentarios_servicio_fk_af9736b6_fk_servicios_id` (`servicio_fk`),
  ADD KEY `comentarios_usuario_fk_9ba7d8e7_fk_usuario_id` (`usuario_fk`);

--
-- Indexes for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  ADD KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`);

--
-- Indexes for table `django_content_type`
--
ALTER TABLE `django_content_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`);

--
-- Indexes for table `django_migrations`
--
ALTER TABLE `django_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `django_session`
--
ALTER TABLE `django_session`
  ADD PRIMARY KEY (`session_key`),
  ADD KEY `django_session_expire_date_a5c62663` (`expire_date`);

--
-- Indexes for table `favoritos`
--
ALTER TABLE `favoritos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `favoritos_usuario_id_favorito_id_043185f3_uniq` (`usuario_id`,`favorito_id`),
  ADD KEY `favoritos_favorito_id_90999b62_fk_usuario_id` (`favorito_id`);

--
-- Indexes for table `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `servicios_categoria_id_ab82091d_fk_categoria_categoria_id` (`categoria_id`),
  ADD KEY `servicios_proveedor_id_611ef217_fk_usuario_id` (`proveedor_id`);

--
-- Indexes for table `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo_electronico` (`correo_electronico`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `auth_group`
--
ALTER TABLE `auth_group`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_permission`
--
ALTER TABLE `auth_permission`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `auth_user`
--
ALTER TABLE `auth_user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categoria`
--
ALTER TABLE `categoria`
  MODIFY `categoria_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `comentarios`
--
ALTER TABLE `comentarios`
  MODIFY `comentario_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `django_content_type`
--
ALTER TABLE `django_content_type`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `django_migrations`
--
ALTER TABLE `django_migrations`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `favoritos`
--
ALTER TABLE `favoritos`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `servicios`
--
ALTER TABLE `servicios`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);

--
-- Constraints for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`);

--
-- Constraints for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  ADD CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `comentarios`
--
ALTER TABLE `comentarios`
  ADD CONSTRAINT `comentarios_servicio_fk_af9736b6_fk_servicios_id` FOREIGN KEY (`servicio_fk`) REFERENCES `servicios` (`id`),
  ADD CONSTRAINT `comentarios_usuario_fk_9ba7d8e7_fk_usuario_id` FOREIGN KEY (`usuario_fk`) REFERENCES `usuario` (`id`);

--
-- Constraints for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  ADD CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `favoritos`
--
ALTER TABLE `favoritos`
  ADD CONSTRAINT `favoritos_favorito_id_90999b62_fk_usuario_id` FOREIGN KEY (`favorito_id`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `favoritos_usuario_id_b6cf59b1_fk_usuario_id` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`);

--
-- Constraints for table `servicios`
--
ALTER TABLE `servicios`
  ADD CONSTRAINT `servicios_categoria_id_ab82091d_fk_categoria_categoria_id` FOREIGN KEY (`categoria_id`) REFERENCES `categoria` (`categoria_id`),
  ADD CONSTRAINT `servicios_proveedor_id_611ef217_fk_usuario_id` FOREIGN KEY (`proveedor_id`) REFERENCES `usuario` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
