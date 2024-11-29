-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS `proximidad`;

USE `proximidad`;

-- Crear la tabla usuario
CREATE TABLE IF NOT EXISTS `usuario` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `nombre_completo` VARCHAR(100) NOT NULL,
    `correo_electronico` VARCHAR(100) NOT NULL UNIQUE,
    `telefono` VARCHAR(15) NOT NULL,
    `direccion` VARCHAR(200) NOT NULL,
    `cedula` VARCHAR(100) NOT NULL,
    `codigo_verificacion` INT NOT NULL,
    `tipo_usuario` ENUM('proveedor', 'arrendador') NOT NULL,
    PRIMARY KEY (`id`)
);

-- Crear la tabla categoria
CREATE TABLE IF NOT EXISTS `categoria` (
    `categoria_id` BIGINT NOT NULL AUTO_INCREMENT,
    `nombre_categoria` VARCHAR(100) NOT NULL,
    `descripcion_categoria` TEXT,
    PRIMARY KEY (`categoria_id`)
);

-- Crear la tabla servicios
CREATE TABLE IF NOT EXISTS `servicios` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `nombre_servicio` VARCHAR(100) NOT NULL,
    `descripcion` TEXT NOT NULL,
    `precio_base` DECIMAL(10, 2) NOT NULL,
    `proveedor_id` BIGINT,
    `categoria_id` BIGINT,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`proveedor_id`) REFERENCES `usuario`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`categoria_id`) REFERENCES `categoria`(`categoria_id`) ON DELETE SET NULL
);

-- Crear la tabla historial_servicios
CREATE TABLE IF NOT EXISTS `historial_servicios` (
    `historial_id` BIGINT NOT NULL AUTO_INCREMENT,
    `servicio_id` BIGINT,
    `arrendador_id` BIGINT,
    `fecha_arrendamiento` DATETIME NOT NULL,
    `duracion` INT NOT NULL,  -- duración en días
    `estado` ENUM('activo', 'finalizado', 'cancelado') NOT NULL,
    PRIMARY KEY (`historial_id`),
    FOREIGN KEY (`servicio_id`) REFERENCES `servicios`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`arrendador_id`) REFERENCES `usuario`(`id`) ON DELETE CASCADE
);
