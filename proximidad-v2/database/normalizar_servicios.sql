-- ============================================================
--    SCRIPT DE NORMALIZACIÓN COMPLETA DE BASE DE DATOS
-- ============================================================
-- Este script normaliza TODAS las tablas de la aplicación:
-- - usuario
-- - categoria
-- - servicios
-- - servicio_imagenes
-- - comentarios
-- - favoritos
-- ============================================================

USE proxima;

-- ============================================================
-- TABLA: usuario
-- ============================================================
DESCRIBE usuario;

-- Normalizar campos de usuario
ALTER TABLE usuario 
MODIFY COLUMN activo tinyint(1) NOT NULL DEFAULT 1;

ALTER TABLE usuario 
MODIFY COLUMN codigo_verificacion int NULL DEFAULT 0;

ALTER TABLE usuario 
MODIFY COLUMN fecha_registro datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6);

ALTER TABLE usuario 
MODIFY COLUMN ultima_actualizacion datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6);

-- Actualizar registros NULL
UPDATE usuario SET activo = 1 WHERE activo IS NULL;
UPDATE usuario SET codigo_verificacion = 0 WHERE codigo_verificacion IS NULL;

-- ============================================================
-- TABLA: categoria
-- ============================================================
DESCRIBE categoria;

-- Normalizar campos de categoria
ALTER TABLE categoria 
MODIFY COLUMN activo tinyint(1) NOT NULL DEFAULT 1;

ALTER TABLE categoria 
MODIFY COLUMN orden int unsigned NOT NULL DEFAULT 0;

-- Actualizar registros NULL
UPDATE categoria SET activo = 1 WHERE activo IS NULL;

-- ============================================================
-- TABLA: servicios
-- ============================================================
DESCRIBE servicios;

-- Asegurar que activo tenga valor por defecto
ALTER TABLE servicios 
MODIFY COLUMN activo tinyint(1) NOT NULL DEFAULT 1;

-- Asegurar que destacado tenga valor por defecto
ALTER TABLE servicios 
MODIFY COLUMN destacado tinyint(1) NOT NULL DEFAULT 0;

-- Asegurar que views tenga valor por defecto
ALTER TABLE servicios 
MODIFY COLUMN views int unsigned NOT NULL DEFAULT 0;

-- Asegurar que ubicacion tenga valor por defecto (vacío si no se proporciona)
ALTER TABLE servicios 
MODIFY COLUMN ubicacion varchar(200) NOT NULL DEFAULT '';

-- Asegurar que fecha_creacion tenga valor por defecto
ALTER TABLE servicios 
MODIFY COLUMN fecha_creacion datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6);

-- Asegurar que fecha_actualizacion se actualice automáticamente
ALTER TABLE servicios 
MODIFY COLUMN fecha_actualizacion datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6);

-- ============================================================
-- PASO 2: Reordenar columnas de forma lógica (OPCIONAL)
-- ============================================================
-- NOTA: Este paso puede tardar en tablas grandes y bloquea la tabla
-- Comentar si prefieres mantener el orden actual

-- Orden lógico propuesto:
-- 1. ID y campos principales
-- 2. Relaciones (FK)
-- 3. Campos de estado
-- 4. Campos de metadata
-- 5. Timestamps

/*
ALTER TABLE servicios 
MODIFY COLUMN id bigint NOT NULL AUTO_INCREMENT FIRST,
MODIFY COLUMN nombre_servicio varchar(100) NOT NULL AFTER id,
MODIFY COLUMN descripcion longtext NOT NULL AFTER nombre_servicio,
MODIFY COLUMN precio_base decimal(10,2) NOT NULL AFTER descripcion,
MODIFY COLUMN ubicacion varchar(200) NOT NULL DEFAULT '' AFTER precio_base,
MODIFY COLUMN imagen varchar(100) NULL AFTER ubicacion,
MODIFY COLUMN imagen_url varchar(255) NULL AFTER imagen,
MODIFY COLUMN categoria_id bigint NULL AFTER imagen_url,
MODIFY COLUMN proveedor_id bigint NULL AFTER categoria_id,
MODIFY COLUMN activo tinyint(1) NOT NULL DEFAULT 1 AFTER proveedor_id,
MODIFY COLUMN destacado tinyint(1) NOT NULL DEFAULT 0 AFTER activo,
MODIFY COLUMN views int unsigned NOT NULL DEFAULT 0 AFTER destacado,
MODIFY COLUMN fecha_creacion datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) AFTER views,
MODIFY COLUMN fecha_actualizacion datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) AFTER fecha_creacion;
*/

-- ============================================================
-- TABLA: servicio_imagenes
-- ============================================================
DESCRIBE servicio_imagenes;

-- Ya está bien normalizada con valores por defecto correctos
-- Solo verificar que es_principal y orden tengan índices

-- ============================================================
-- TABLA: comentarios
-- ============================================================
DESCRIBE comentarios;

-- Normalizar campos de comentarios
ALTER TABLE comentarios 
MODIFY COLUMN activo tinyint(1) NOT NULL DEFAULT 1;

ALTER TABLE comentarios 
MODIFY COLUMN fecha_creacion datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6);

-- Actualizar registros NULL
UPDATE comentarios SET activo = 1 WHERE activo IS NULL;

-- ============================================================
-- TABLA: favoritos
-- ============================================================
DESCRIBE favoritos;

-- Normalizar campos de favoritos
ALTER TABLE favoritos 
MODIFY COLUMN fecha_agregado datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6);

ALTER TABLE favoritos 
MODIFY COLUMN tipo_favorito varchar(10) NOT NULL DEFAULT 'servicio';

-- Actualizar registros NULL
UPDATE favoritos SET tipo_favorito = 'servicio' WHERE tipo_favorito IS NULL OR tipo_favorito = '';

-- ============================================================
-- PASO 3: Agregar índices faltantes si no existen
-- ============================================================

-- SERVICIOS: Verificar índices existentes
SHOW INDEX FROM servicios;

-- Agregar índices compuestos (MySQL no soporta IF NOT EXISTS, los errores se ignoran)
CREATE INDEX idx_categoria_activo_destacado 
ON servicios (categoria_id, activo, destacado);

CREATE INDEX idx_proveedor_activo 
ON servicios (proveedor_id, activo);

CREATE INDEX idx_destacado_activo_views 
ON servicios (destacado, activo, views DESC);

-- ============================================================
-- PASO 4: Actualizar registros existentes con valores NULL
-- ============================================================

-- Establecer activo=1 en registros antiguos que tengan NULL
UPDATE servicios SET activo = 1 WHERE activo IS NULL;

-- Establecer destacado=0 en registros antiguos que tengan NULL
UPDATE servicios SET destacado = 0 WHERE destacado IS NULL;

-- Establecer views=0 en registros antiguos que tengan NULL
UPDATE servicios SET views = 0 WHERE views IS NULL;

-- Establecer ubicacion vacía en registros antiguos que tengan NULL
UPDATE servicios SET ubicacion = '' WHERE ubicacion IS NULL OR ubicacion = 'NULL';

-- USUARIO: Agregar índices compuestos útiles
CREATE INDEX idx_usuario_tipo_activo 
ON usuario (tipo_usuario, activo);

CREATE INDEX idx_usuario_fecha_registro 
ON usuario (fecha_registro DESC);

-- COMENTARIOS: Agregar índices compuestos
CREATE INDEX idx_comentarios_servicio_activo 
ON comentarios (servicio_fk, activo);

CREATE INDEX idx_comentarios_usuario_activo 
ON comentarios (usuario_fk, activo);

CREATE INDEX idx_comentarios_calificacion 
ON comentarios (calificacion);

-- FAVORITOS: Agregar índices compuestos
CREATE INDEX idx_favoritos_usuario_tipo 
ON favoritos (usuario_id, tipo_favorito);

CREATE INDEX idx_favoritos_servicio 
ON favoritos (favorito_servicio_id);

CREATE INDEX idx_favoritos_usuario_favorito 
ON favoritos (favorito_usuario_id);

-- ============================================================
-- VERIFICACIÓN FINAL
-- ============================================================

-- Ver estructura final de todas las tablas
SELECT '=== ESTRUCTURA TABLA: usuario ===' as '';
DESCRIBE usuario;

SELECT '=== ESTRUCTURA TABLA: categoria ===' as '';
DESCRIBE categoria;

SELECT '=== ESTRUCTURA TABLA: servicios ===' as '';
DESCRIBE servicios;

SELECT '=== ESTRUCTURA TABLA: servicio_imagenes ===' as '';
DESCRIBE servicio_imagenes;

SELECT '=== ESTRUCTURA TABLA: comentarios ===' as '';
DESCRIBE comentarios;

SELECT '=== ESTRUCTURA TABLA: favoritos ===' as '';
DESCRIBE favoritos;

-- Contar registros en cada tabla
SELECT '=== CONTEO DE REGISTROS ===' as '';
SELECT 'Usuarios' as tabla, COUNT(*) as total FROM usuario
UNION ALL
SELECT 'Categorías' as tabla, COUNT(*) as total FROM categoria
UNION ALL
SELECT 'Servicios' as tabla, COUNT(*) as total FROM servicios
UNION ALL
SELECT 'Imágenes de Servicios' as tabla, COUNT(*) as total FROM servicio_imagenes
UNION ALL
SELECT 'Comentarios' as tabla, COUNT(*) as total FROM comentarios
UNION ALL
SELECT 'Favoritos' as tabla, COUNT(*) as total FROM favoritos;

-- Ver índices de servicios
SELECT '=== ÍNDICES DE SERVICIOS ===' as '';
SHOW INDEX FROM servicios;

-- ============================================================
--    INFORMACIÓN IMPORTANTE
-- ============================================================
-- Este script normaliza TODAS las tablas de la aplicación:
--
-- CAMBIOS REALIZADOS:
-- 
-- USUARIO:
-- - activo: DEFAULT 1, NOT NULL
-- - codigo_verificacion: DEFAULT 0
-- - fecha_registro: DEFAULT CURRENT_TIMESTAMP(6)
-- - ultima_actualizacion: AUTO UPDATE
--
-- CATEGORIA:
-- - activo: DEFAULT 1, NOT NULL
-- - orden: DEFAULT 0, NOT NULL
--
-- SERVICIOS:
-- - activo: DEFAULT 1, NOT NULL
-- - destacado: DEFAULT 0, NOT NULL
-- - views: DEFAULT 0, NOT NULL
-- - ubicacion: DEFAULT '', NOT NULL
-- - fecha_creacion: DEFAULT CURRENT_TIMESTAMP(6)
-- - fecha_actualizacion: AUTO UPDATE
--
-- SERVICIO_IMAGENES:
-- - Ya normalizada correctamente
--
-- COMENTARIOS:
-- - activo: DEFAULT 1, NOT NULL
-- - fecha_creacion: DEFAULT CURRENT_TIMESTAMP(6)
--
-- FAVORITOS:
-- - fecha_agregado: DEFAULT CURRENT_TIMESTAMP(6)
-- - tipo_favorito: DEFAULT 'servicio'
--
-- ÍNDICES:
-- - Agregados índices compuestos para mejorar performance
-- - Índices en todas las FK y campos frecuentemente consultados
--
-- NOTA: El reordenamiento de columnas está comentado para evitar
-- bloqueos en tablas grandes. Descomenta si lo necesitas.
-- ============================================================
