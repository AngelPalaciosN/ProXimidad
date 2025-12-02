-- ============================================================
--    SCRIPT PARA CREAR TABLA DE CATEGORÍAS Y DATOS INICIALES
-- ============================================================

USE proxima;

-- Crear tabla categoria si no existe
CREATE TABLE IF NOT EXISTS `categoria` (
  `categoria_id` bigint NOT NULL AUTO_INCREMENT,
  `nombre_categoria` varchar(100) NOT NULL,
  `descripcion` text,
  `icono` varchar(50) DEFAULT NULL,
  `color` varchar(20) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_creacion` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`categoria_id`),
  UNIQUE KEY `nombre_categoria` (`nombre_categoria`),
  KEY `categoria_activo_idx` (`activo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insertar categorías estándar
INSERT INTO `categoria` (`nombre_categoria`, `descripcion`, `icono`, `color`, `activo`) VALUES
('Tecnología', 'Desarrollo web, apps, software, TI y servicios tecnológicos', 'FaCode', '#667eea', 1),
('Educación', 'Clases, tutorías, cursos y capacitaciones', 'FaGraduationCap', '#f6ad55', 1),
('Consultoría', 'Asesoría empresarial, legal, financiera y profesional', 'FaBriefcase', '#4299e1', 1),
('Diseño', 'Diseño gráfico, web, identidad corporativa y creatividad', 'FaPalette', '#ed64a6', 1),
('Fotografía', 'Fotografía profesional, edición y producción audiovisual', 'FaCamera', '#48bb78', 1),
('Reparación', 'Reparación de electrodomésticos, equipos y mantenimiento', 'FaTools', '#fc8181', 1),
('Salud y Bienestar', 'Terapias, psicología, nutrición y servicios de salud', 'FaHeartbeat', '#f687b3', 1),
('Marketing', 'Marketing digital, publicidad, redes sociales y SEO', 'FaBullhorn', '#9f7aea', 1),
('Hogar y Jardinería', 'Limpieza, jardinería, decoración y servicios del hogar', 'FaHome', '#38b2ac', 1),
('Deportes y Fitness', 'Entrenamiento personal, coaching deportivo y actividad física', 'FaDumbbell', '#ed8936', 1),
('Eventos', 'Organización de eventos, catering, animación y logística', 'FaCalendarAlt', '#4fd1c5', 1),
('Transporte', 'Mudanzas, mensajería, transporte de personas y carga', 'FaTruck', '#718096', 1),
('Belleza', 'Peluquería, estética, maquillaje y cuidado personal', 'FaCut', '#f56565', 1),
('Música y Arte', 'Clases de música, arte, instrumentos y producción', 'FaMusic', '#7c3aed', 1),
('Mascotas', 'Veterinaria, peluquería canina, adiestramiento y cuidado', 'FaPaw', '#10b981', 1)
ON DUPLICATE KEY UPDATE 
  descripcion = VALUES(descripcion),
  icono = VALUES(icono),
  color = VALUES(color);

-- Verificar inserción
SELECT * FROM categoria ORDER BY categoria_id;

-- ============================================================
--    INFORMACIÓN IMPORTANTE
-- ============================================================
-- Este script crea 15 categorías estándar iniciales
-- Los usuarios podrán solicitar nuevas categorías mediante
-- el formulario de comentarios que se enviará a:
-- proximidadapp@gmail.com
-- ============================================================
