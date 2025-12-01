-- ============================================================
--    TABLA PARA MÚLTIPLES IMÁGENES POR SERVICIO
-- ============================================================

USE proxima;

-- Crear tabla para almacenar múltiples imágenes por servicio
CREATE TABLE IF NOT EXISTS `servicio_imagenes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `servicio_id` bigint NOT NULL,
  `imagen` varchar(100) NOT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  `orden` int unsigned NOT NULL DEFAULT 0,
  `es_principal` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_creacion` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `servicio_imagenes_servicio_id_idx` (`servicio_id`),
  KEY `servicio_imagenes_orden_idx` (`orden`),
  KEY `servicio_imagenes_principal_idx` (`es_principal`),
  CONSTRAINT `servicio_imagenes_servicio_fk` 
    FOREIGN KEY (`servicio_id`) 
    REFERENCES `servicios` (`id`) 
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Verificar creación
DESCRIBE servicio_imagenes;

-- ============================================================
--    INFORMACIÓN IMPORTANTE
-- ============================================================
-- Esta tabla permite:
-- - Hasta 5 imágenes por servicio (controlado por lógica del backend)
-- - campo 'orden' para ordenar las imágenes (1, 2, 3, 4, 5)
-- - campo 'es_principal' para marcar la imagen principal (la primera)
-- - CASCADE DELETE: si se elimina el servicio, se eliminan sus imágenes
-- ============================================================
