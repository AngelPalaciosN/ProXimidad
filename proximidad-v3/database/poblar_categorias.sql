-- ============================================================
--    SCRIPT PARA POBLAR TABLA DE CATEGORÍAS
-- ============================================================

USE proxima;

-- Limpiar categorías existentes (opcional, comentar si no se desea)
-- DELETE FROM categoria;

-- Insertar categorías estándar
INSERT INTO `categoria` (`nombre_categoria`, `descripcion_categoria`, `icono`, `color`, `activo`, `orden`) VALUES
('Tecnología', 'Desarrollo web, apps, software, TI y servicios tecnológicos', 'FaCode', '#667eea', 1, 1),
('Educación', 'Clases, tutorías, cursos y capacitaciones', 'FaGraduationCap', '#f6ad55', 1, 2),
('Consultoría', 'Asesoría empresarial, legal, financiera y profesional', 'FaBriefcase', '#4299e1', 1, 3),
('Diseño', 'Diseño gráfico, web, identidad corporativa y creatividad', 'FaPalette', '#ed64a6', 1, 4),
('Fotografía', 'Fotografía profesional, edición y producción audiovisual', 'FaCamera', '#48bb78', 1, 5),
('Reparación', 'Reparación de electrodomésticos, equipos y mantenimiento', 'FaTools', '#fc8181', 1, 6),
('Salud y Bienestar', 'Terapias, psicología, nutrición y servicios de salud', 'FaHeartbeat', '#f687b3', 1, 7),
('Marketing', 'Marketing digital, publicidad, redes sociales y SEO', 'FaBullhorn', '#9f7aea', 1, 8),
('Hogar y Jardinería', 'Limpieza, jardinería, decoración y servicios del hogar', 'FaHome', '#38b2ac', 1, 9),
('Deportes y Fitness', 'Entrenamiento personal, coaching deportivo y actividad física', 'FaDumbbell', '#ed8936', 1, 10),
('Eventos', 'Organización de eventos, catering, animación y logística', 'FaCalendarAlt', '#4fd1c5', 1, 11),
('Transporte', 'Mudanzas, mensajería, transporte de personas y carga', 'FaTruck', '#718096', 1, 12),
('Belleza', 'Peluquería, estética, maquillaje y cuidado personal', 'FaCut', '#f56565', 1, 13),
('Música y Arte', 'Clases de música, arte, instrumentos y producción', 'FaMusic', '#7c3aed', 1, 14),
('Mascotas', 'Veterinaria, peluquería canina, adiestramiento y cuidado', 'FaPaw', '#10b981', 1, 15)
ON DUPLICATE KEY UPDATE 
  descripcion_categoria = VALUES(descripcion_categoria),
  icono = VALUES(icono),
  color = VALUES(color),
  orden = VALUES(orden);

-- Verificar inserción
SELECT categoria_id, nombre_categoria, icono, color, activo, orden FROM categoria ORDER BY orden;

-- ============================================================
--    INFORMACIÓN IMPORTANTE
-- ============================================================
-- Este script crea 15 categorías estándar iniciales
-- Los usuarios podrán solicitar nuevas categorías mediante
-- el formulario de comentarios que se enviará a:
-- proximidadapp@gmail.com
-- ============================================================
