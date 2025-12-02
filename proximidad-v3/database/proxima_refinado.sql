-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: proxima
-- ------------------------------------------------------
-- Server version	8.4.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `proxima`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `proxima` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `proxima`;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add categoria',7,'add_categoria'),(26,'Can change categoria',7,'change_categoria'),(27,'Can delete categoria',7,'delete_categoria'),(28,'Can view categoria',7,'view_categoria'),(29,'Can add usuario',8,'add_usuario'),(30,'Can change usuario',8,'change_usuario'),(31,'Can delete usuario',8,'delete_usuario'),(32,'Can view usuario',8,'view_usuario'),(33,'Can add servicios',9,'add_servicios'),(34,'Can change servicios',9,'change_servicios'),(35,'Can delete servicios',9,'delete_servicios'),(36,'Can view servicios',9,'view_servicios'),(37,'Can add comentarios',10,'add_comentarios'),(38,'Can change comentarios',10,'change_comentarios'),(39,'Can delete comentarios',10,'delete_comentarios'),(40,'Can view comentarios',10,'view_comentarios'),(41,'Can add favoritos',11,'add_favoritos'),(42,'Can change favoritos',11,'change_favoritos'),(43,'Can delete favoritos',11,'delete_favoritos'),(44,'Can view favoritos',11,'view_favoritos');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria` (
  `categoria_id` bigint NOT NULL AUTO_INCREMENT,
  `nombre_categoria` varchar(100) NOT NULL,
  `descripcion_categoria` longtext,
  `activo` tinyint(1) NOT NULL,
  `color` varchar(7) NOT NULL,
  `icono` varchar(50) NOT NULL,
  `orden` int unsigned NOT NULL,
  PRIMARY KEY (`categoria_id`),
  KEY `categoria_nombre_categoria_46740194` (`nombre_categoria`),
  KEY `categoria_nombre__e7493f_idx` (`nombre_categoria`),
  KEY `categoria_activo_367780_idx` (`activo`,`orden`),
  CONSTRAINT `categoria_chk_1` CHECK ((`orden` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
INSERT INTO `categoria` VALUES (1,'Tecnolog├¡a','Servicios relacionados con tecnolog├¡a e inform├ítica',1,'#007bff','fas fa-laptop-code',0),(2,'Educaci├│n','Servicios educativos y de formaci├│n',1,'#28a745','fas fa-graduation-cap',0),(3,'Consultor├¡a','Servicios de consultor├¡a y asesor├¡a',1,'#6f42c1','fas fa-user-tie',0),(4,'Dise├▒o','Servicios de dise├▒o gr├ífico y creativo',1,'#e83e8c','fas fa-palette',0),(5,'Salud','Servicios relacionados con salud y bienestar',1,'#dc3545','fas fa-heartbeat',0),(6,'Hogar','Servicios para el hogar y mantenimiento',1,'#fd7e14','fas fa-home',0);
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comentarios`
--

DROP TABLE IF EXISTS `comentarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comentarios` (
  `comentario_id` bigint NOT NULL AUTO_INCREMENT,
  `mensaje` longtext NOT NULL,
  `servicio_fk` bigint NOT NULL,
  `usuario_fk` bigint NOT NULL,
  `activo` tinyint(1) NOT NULL,
  `calificacion` smallint unsigned DEFAULT NULL,
  `fecha_creacion` datetime(6) NOT NULL,
  PRIMARY KEY (`comentario_id`),
  KEY `comentarios_servici_318b02_idx` (`servicio_fk`),
  KEY `comentarios_usuario_bb2b0b_idx` (`usuario_fk`),
  KEY `comentarios_fecha_c_5f2e38_idx` (`fecha_creacion`),
  KEY `comentarios_calific_85f775_idx` (`calificacion`),
  KEY `comentarios_activo_799eaa_idx` (`activo`),
  CONSTRAINT `comentarios_servicio_fk_af9736b6_fk_servicios_id` FOREIGN KEY (`servicio_fk`) REFERENCES `servicios` (`id`),
  CONSTRAINT `comentarios_usuario_fk_9ba7d8e7_fk_usuario_id` FOREIGN KEY (`usuario_fk`) REFERENCES `usuario` (`id`),
  CONSTRAINT `comentarios_chk_1` CHECK ((`calificacion` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comentarios`
--

LOCK TABLES `comentarios` WRITE;
/*!40000 ALTER TABLE `comentarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `comentarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(3,'auth','group'),(2,'auth','permission'),(4,'auth','user'),(5,'contenttypes','contenttype'),(7,'proximidad_app','categoria'),(10,'proximidad_app','comentarios'),(11,'proximidad_app','favoritos'),(9,'proximidad_app','servicios'),(8,'proximidad_app','usuario'),(6,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2025-10-24 23:58:51.547696'),(2,'auth','0001_initial','2025-10-24 23:58:52.109553'),(3,'admin','0001_initial','2025-10-24 23:58:52.257131'),(4,'admin','0002_logentry_remove_auto_add','2025-10-24 23:58:52.265594'),(5,'admin','0003_logentry_add_action_flag_choices','2025-10-24 23:58:52.274907'),(6,'contenttypes','0002_remove_content_type_name','2025-10-24 23:58:52.367306'),(7,'auth','0002_alter_permission_name_max_length','2025-10-24 23:58:52.437611'),(8,'auth','0003_alter_user_email_max_length','2025-10-24 23:58:52.466120'),(9,'auth','0004_alter_user_username_opts','2025-10-24 23:58:52.476153'),(10,'auth','0005_alter_user_last_login_null','2025-10-24 23:58:52.550903'),(11,'auth','0006_require_contenttypes_0002','2025-10-24 23:58:52.553519'),(12,'auth','0007_alter_validators_add_error_messages','2025-10-24 23:58:52.561861'),(13,'auth','0008_alter_user_username_max_length','2025-10-24 23:58:52.638970'),(14,'auth','0009_alter_user_last_name_max_length','2025-10-24 23:58:52.721152'),(15,'auth','0010_alter_group_name_max_length','2025-10-24 23:58:52.751216'),(16,'auth','0011_update_proxy_permissions','2025-10-24 23:58:52.762121'),(17,'auth','0012_alter_user_first_name_max_length','2025-10-24 23:58:52.842199'),(18,'proximidad_app','0001_initial','2025-10-24 23:58:53.332953'),(19,'proximidad_app','0002_alter_usuario_codigo_verificacion_and_more','2025-10-24 23:58:53.474538'),(20,'proximidad_app','0003_servicios_activo_servicios_fecha_actualizacion_and_more','2025-10-24 23:58:53.632671'),(21,'proximidad_app','0004_auto_20250825_2051','2025-10-24 23:58:53.648616'),(22,'proximidad_app','0005_categoria_activo_categoria_color_categoria_icono_and_more','2025-10-24 23:58:55.111154'),(23,'proximidad_app','0006_remove_favoritos_favoritos_usuario_ed02b8_idx_and_more','2025-10-24 23:58:55.684050'),(24,'proximidad_app','0007_agregar_banner_usuario','2025-10-24 23:58:55.734299'),(25,'proximidad_app','0008_remove_favoritos_unique_usuario_favorito_and_more','2025-10-24 23:58:55.807086'),(26,'sessions','0001_initial','2025-10-24 23:58:55.839586');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favoritos`
--

DROP TABLE IF EXISTS `favoritos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favoritos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint NOT NULL,
  `fecha_agregado` datetime(6) NOT NULL,
  `favorito_servicio_id` bigint DEFAULT NULL,
  `favorito_usuario_id` bigint DEFAULT NULL,
  `tipo_favorito` varchar(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `favoritos_fecha_a_cd1352_idx` (`fecha_agregado`),
  KEY `favoritos_usuario_id_b6cf59b1` (`usuario_id`),
  KEY `favoritos_usuario_347b9b_idx` (`usuario_id`,`tipo_favorito`),
  KEY `favoritos_favorit_f6c59e_idx` (`favorito_usuario_id`),
  KEY `favoritos_favorit_400e1b_idx` (`favorito_servicio_id`),
  KEY `favoritos_usuario_bf0ebe_idx` (`usuario_id`,`favorito_usuario_id`),
  KEY `favoritos_usuario_587f8c_idx` (`usuario_id`,`favorito_servicio_id`),
  CONSTRAINT `favoritos_favorito_servicio_id_79075d09_fk_servicios_id` FOREIGN KEY (`favorito_servicio_id`) REFERENCES `servicios` (`id`),
  CONSTRAINT `favoritos_favorito_usuario_id_c6fdc0f1_fk_usuario_id` FOREIGN KEY (`favorito_usuario_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `favoritos_usuario_id_b6cf59b1_fk_usuario_id` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favoritos`
--

LOCK TABLES `favoritos` WRITE;
/*!40000 ALTER TABLE `favoritos` DISABLE KEYS */;
INSERT INTO `favoritos` VALUES (1,2,'2025-10-25 01:02:27.138014',NULL,1,'usuario');
/*!40000 ALTER TABLE `favoritos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicios`
--

DROP TABLE IF EXISTS `servicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicios` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre_servicio` varchar(100) NOT NULL,
  `descripcion` longtext NOT NULL,
  `precio_base` decimal(10,2) NOT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  `categoria_id` bigint DEFAULT NULL,
  `proveedor_id` bigint DEFAULT NULL,
  `activo` tinyint(1) NOT NULL,
  `fecha_actualizacion` datetime(6) NOT NULL,
  `fecha_creacion` datetime(6) NOT NULL,
  `imagen` varchar(100) DEFAULT NULL,
  `destacado` tinyint(1) NOT NULL,
  `ubicacion` varchar(200) NOT NULL,
  `views` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `servicios_activo_9386ce9f` (`activo`),
  KEY `servicios_fecha_creacion_a76ffa62` (`fecha_creacion`),
  KEY `servicios_nombre_servicio_991349ac` (`nombre_servicio`),
  KEY `servicios_precio_base_c61e3988` (`precio_base`),
  KEY `servicios_nombre__242c77_idx` (`nombre_servicio`),
  KEY `servicios_precio__28aa9e_idx` (`precio_base`),
  KEY `servicios_activo_b28cb8_idx` (`activo`,`destacado`),
  KEY `servicios_categor_398a50_idx` (`categoria_id`,`activo`),
  KEY `servicios_proveed_2c353c_idx` (`proveedor_id`,`activo`),
  KEY `servicios_views_94f172_idx` (`views`),
  KEY `servicios_fecha_c_77edc0_idx` (`fecha_creacion`),
  KEY `servicios_destacado_c74f30c7` (`destacado`),
  KEY `servicios_views_ae6bf6ce` (`views`),
  CONSTRAINT `servicios_categoria_id_ab82091d_fk_categoria_categoria_id` FOREIGN KEY (`categoria_id`) REFERENCES `categoria` (`categoria_id`),
  CONSTRAINT `servicios_proveedor_id_611ef217_fk_usuario_id` FOREIGN KEY (`proveedor_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `servicios_chk_1` CHECK ((`views` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicios`
--

LOCK TABLES `servicios` WRITE;
/*!40000 ALTER TABLE `servicios` DISABLE KEYS */;
INSERT INTO `servicios` VALUES (1,'Fotograf├¡a de Eventos Avanzado','Cobertura fotogr├ífica profesional para eventos sociales y corporativos. Incluye edici├│n digital y entrega en alta resoluci├│n.',725054.00,NULL,4,1,1,'2025-10-25 00:37:20.224586','2025-10-25 00:37:20.224169','',1,'Calle 73',32),(2,'Desarrollo Web Personalizado Premium','Desarrollo de sitios web modernos y responsivos usando las ├║ltimas tecnolog├¡as. Incluye dise├▒o UX/UI, desarrollo frontend y backend, optimizaci├│n SEO y hosting.',1816460.00,NULL,1,1,1,'2025-10-25 00:37:20.230287','2025-10-25 00:37:20.229932','',0,'Calle 73',6),(3,'Coaching Empresarial Express','Coaching ejecutivo y empresarial para desarrollo de liderazgo, gesti├│n de equipos y mejora de productividad organizacional.',605454.00,NULL,3,1,1,'2025-10-25 00:37:20.235741','2025-10-25 00:37:20.235458','',0,'Calle 73',97),(4,'Reparaci├│n de Electrodom├®sticos Express','Servicio t├®cnico especializado en reparaci├│n de electrodom├®sticos de l├¡nea blanca y peque├▒os electrodom├®sticos. Diagn├│stico gratuito.',127916.00,NULL,6,1,1,'2025-10-25 00:37:20.240839','2025-10-25 00:37:20.240589','',0,'Calle 73',41),(5,'Dise├▒o de Identidad Corporativa B├ísico','Creaci├│n completa de identidad visual para empresas: logo, paleta de colores, tipograf├¡a, papeler├¡a y manual de marca.',1227182.00,NULL,4,1,1,'2025-10-25 00:37:20.245722','2025-10-25 00:37:20.245395','',1,'Calle 73',39),(6,'Aplicaciones M├│viles Nativas Premium','Desarrollo de aplicaciones m├│viles para Android e iOS con funcionalidades avanzadas, integraci├│n con APIs y dise├▒o intuitivo.',1655646.00,NULL,1,2,1,'2025-10-25 00:37:20.252855','2025-10-25 00:37:20.252353','',0,'Debajo de un puente',100),(7,'Terapia Psicol├│gica Individual Premium','Sesiones de terapia psicol├│gica para adultos, enfoque cognitivo-conductual, manejo de ansiedad, depresi├│n y desarrollo personal.',228674.00,NULL,5,2,1,'2025-10-25 00:37:20.258247','2025-10-25 00:37:20.257957','',0,'Debajo de un puente',5),(8,'Desarrollo Web Personalizado B├ísico','Desarrollo de sitios web modernos y responsivos usando las ├║ltimas tecnolog├¡as. Incluye dise├▒o UX/UI, desarrollo frontend y backend, optimizaci├│n SEO y hosting.',1970818.00,NULL,1,2,1,'2025-10-25 00:37:20.263439','2025-10-25 00:37:20.263192','',1,'Debajo de un puente',89),(9,'Clases Particulares de Matem├íticas Express','Tutor├¡a personalizada en matem├íticas para estudiantes de primaria, secundaria y universidad. Metodolog├¡a adaptada a cada estudiante.',174659.00,NULL,2,2,1,'2025-10-25 00:37:20.268617','2025-10-25 00:37:20.268370','',0,'Debajo de un puente',34),(10,'Dise├▒o Gr├ífico y Publicitario Plus','Creaci├│n de material publicitario impreso y digital: brochures, cat├ílogos, banners, posts para redes sociales y presentaciones corporativas.',478315.00,NULL,4,2,1,'2025-10-25 00:37:20.274911','2025-10-25 00:37:20.274540','',0,'Debajo de un puente',44);
/*!40000 ALTER TABLE `servicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre_completo` varchar(100) NOT NULL,
  `correo_electronico` varchar(100) NOT NULL,
  `telefono` varchar(15) NOT NULL,
  `direccion` varchar(200) NOT NULL,
  `cedula` varchar(100) NOT NULL,
  `codigo_verificacion` int DEFAULT NULL,
  `tipo_usuario` varchar(50) NOT NULL,
  `imagen` varchar(100) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL,
  `fecha_registro` datetime(6) NOT NULL,
  `ultima_actualizacion` datetime(6) NOT NULL,
  `banner` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo_electronico` (`correo_electronico`),
  UNIQUE KEY `usuario_cedula_f39aaf76_uniq` (`cedula`),
  KEY `usuario_nombre_completo_261b6443` (`nombre_completo`),
  KEY `usuario_correo__eb4fac_idx` (`correo_electronico`),
  KEY `usuario_cedula_594ed2_idx` (`cedula`),
  KEY `usuario_tipo_us_8871f9_idx` (`tipo_usuario`),
  KEY `usuario_activo_2eb730_idx` (`activo`),
  KEY `usuario_fecha_r_67c773_idx` (`fecha_registro`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Angel David Palacios','palacios@gmail.com','3002039992','Calle 73','1023837626',844875,'proveedor','usuarios/c0996f0e-1eaf-44fb-abe7-4644c631d20c.jpg',1,'2025-10-25 00:30:12.611935','2025-11-13 01:37:09.409368','usuarios/4b772b70-5b67-48b6-b6d8-4710a829f6ca.jpg'),(2,'Manolito','manolinelcrack@gmail.com','3122446969','Debajo de un puente','1243749986',556250,'proveedor','',1,'2025-10-25 00:32:00.642782','2025-10-25 01:01:53.480920',''),(3,'Prueba Encarpe','Luisangelsuarezquintero7@gmail.com','3002039444','Calle 73 22','1023837333',320003,'arrendador','usuarios/a74cffdd-0078-4594-b20e-ac4a78fdfe51.jpg',0,'2025-11-22 01:14:56.884648','2025-11-22 01:15:02.390768','usuarios/d63ac6cc-6445-4d73-9a1b-ffcf68db276f.jpg');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-21 20:15:48
