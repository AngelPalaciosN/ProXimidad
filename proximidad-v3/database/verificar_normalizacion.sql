-- ============================================================
--    SCRIPT DE VERIFICACIÓN POST-NORMALIZACIÓN
-- ============================================================
-- Este script verifica que la base de datos esté lista para
-- recibir datos desde el backend Django
-- ============================================================

USE proxima;

-- ============================================================
-- 1. VERIFICAR VALORES POR DEFECTO
-- ============================================================

SELECT 'VERIFICANDO VALORES POR DEFECTO...' as '';

-- Servicios
SELECT 
    'servicios.activo' as campo,
    COLUMN_DEFAULT as valor_defecto,
    IS_NULLABLE as nullable
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'proxima' 
    AND TABLE_NAME = 'servicios' 
    AND COLUMN_NAME = 'activo';

SELECT 
    'servicios.destacado' as campo,
    COLUMN_DEFAULT as valor_defecto,
    IS_NULLABLE as nullable
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'proxima' 
    AND TABLE_NAME = 'servicios' 
    AND COLUMN_NAME = 'destacado';

SELECT 
    'servicios.views' as campo,
    COLUMN_DEFAULT as valor_defecto,
    IS_NULLABLE as nullable
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'proxima' 
    AND TABLE_NAME = 'servicios' 
    AND COLUMN_NAME = 'views';

SELECT 
    'servicios.fecha_creacion' as campo,
    COLUMN_DEFAULT as valor_defecto,
    IS_NULLABLE as nullable
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'proxima' 
    AND TABLE_NAME = 'servicios' 
    AND COLUMN_NAME = 'fecha_creacion';

-- ============================================================
-- 2. VERIFICAR FOREIGN KEYS
-- ============================================================

SELECT 'VERIFICANDO FOREIGN KEYS...' as '';

SELECT 
    CONSTRAINT_NAME as fk_name,
    TABLE_NAME as tabla,
    COLUMN_NAME as columna,
    REFERENCED_TABLE_NAME as tabla_referenciada,
    REFERENCED_COLUMN_NAME as columna_referenciada
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'proxima'
    AND TABLE_NAME IN ('servicios', 'servicio_imagenes', 'comentarios', 'favoritos')
    AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY TABLE_NAME;

-- ============================================================
-- 3. VERIFICAR ÍNDICES
-- ============================================================

SELECT 'VERIFICANDO ÍNDICES COMPUESTOS...' as '';

SELECT 
    TABLE_NAME as tabla,
    INDEX_NAME as indice,
    GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) as columnas
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'proxima'
    AND TABLE_NAME IN ('servicios', 'usuario', 'comentarios', 'favoritos')
    AND INDEX_NAME LIKE 'idx_%'
GROUP BY TABLE_NAME, INDEX_NAME
ORDER BY TABLE_NAME, INDEX_NAME;

-- ============================================================
-- 4. INSERTAR SERVICIO DE PRUEBA (simulando backend)
-- ============================================================

SELECT 'INSERTANDO SERVICIO DE PRUEBA...' as '';

-- Primero verificar que existe un usuario proveedor
SET @proveedor_id = (SELECT id FROM usuario WHERE tipo_usuario = 'proveedor' LIMIT 1);
SET @categoria_id = (SELECT categoria_id FROM categoria WHERE activo = 1 LIMIT 1);

SELECT 
    CASE 
        WHEN @proveedor_id IS NULL THEN '❌ ERROR: No hay usuarios proveedores'
        WHEN @categoria_id IS NULL THEN '❌ ERROR: No hay categorías activas'
        ELSE '✅ OK: Datos necesarios disponibles'
    END as estado;

-- Insertar servicio de prueba (solo si hay datos)
INSERT INTO servicios (
    nombre_servicio,
    descripcion,
    precio_base,
    categoria_id,
    proveedor_id,
    ubicacion
) 
SELECT 
    'Servicio de Prueba Post-Normalización',
    'Este es un servicio creado automáticamente para verificar que la base de datos funciona correctamente después de la normalización. Debe tener activo=1, destacado=0, views=0 y timestamps automáticos.',
    99.99,
    @categoria_id,
    @proveedor_id,
    'Ubicación de Prueba'
WHERE @proveedor_id IS NOT NULL AND @categoria_id IS NOT NULL;

-- Verificar el servicio insertado
SELECT 
    id,
    nombre_servicio,
    activo,
    destacado,
    views,
    fecha_creacion,
    fecha_actualizacion
FROM servicios 
WHERE nombre_servicio = 'Servicio de Prueba Post-Normalización';

-- ============================================================
-- 5. INSERTAR IMÁGENES DE PRUEBA
-- ============================================================

SELECT 'INSERTANDO IMÁGENES DE PRUEBA...' as '';

SET @servicio_test_id = (
    SELECT id FROM servicios 
    WHERE nombre_servicio = 'Servicio de Prueba Post-Normalización' 
    LIMIT 1
);

-- Insertar 3 imágenes de prueba
INSERT INTO servicio_imagenes (servicio_id, imagen, orden, es_principal)
VALUES 
    (@servicio_test_id, 'test/imagen1.jpg', 1, 1),
    (@servicio_test_id, 'test/imagen2.jpg', 2, 0),
    (@servicio_test_id, 'test/imagen3.jpg', 3, 0);

-- Verificar las imágenes insertadas
SELECT 
    id,
    servicio_id,
    imagen,
    orden,
    es_principal,
    fecha_creacion
FROM servicio_imagenes 
WHERE servicio_id = @servicio_test_id;

-- ============================================================
-- 6. LIMPIEZA (OPCIONAL)
-- ============================================================

SELECT 'LIMPIEZA DE DATOS DE PRUEBA...' as '';

-- Descomentar para eliminar los datos de prueba
-- DELETE FROM servicio_imagenes WHERE servicio_id = @servicio_test_id;
-- DELETE FROM servicios WHERE id = @servicio_test_id;

SELECT '✅ VERIFICACIÓN COMPLETA - Base de datos lista para Django' as resultado;
