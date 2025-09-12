"""
Utilidades para procesamiento de imágenes en ProXimidad
"""

from PIL import Image
import io
from django.core.files.uploadedfile import InMemoryUploadedFile
import sys
import os

class ImageProcessor:
    """Procesador de imágenes para optimizar tamaño y calidad"""
    
    # Configuraciones por defecto
    DEFAULT_QUALITY = 85
    MAX_WIDTH = 800
    MAX_HEIGHT = 600
    
    @staticmethod
    def optimize_image(image_field, max_width=MAX_WIDTH, max_height=MAX_HEIGHT, quality=DEFAULT_QUALITY):
        """
        Optimiza una imagen reduciendo su tamaño y calidad
        
        Args:
            image_field: ImageField de Django
            max_width: Ancho máximo en píxeles
            max_height: Alto máximo en píxeles
            quality: Calidad JPEG (1-100)
            
        Returns:
            InMemoryUploadedFile: Imagen optimizada
        """
        try:
            # Abrir la imagen
            img = Image.open(image_field)
            
            # Convertir a RGB si es necesario (para PNG con transparencia)
            if img.mode in ('RGBA', 'LA', 'P'):
                img = img.convert('RGB')
            
            # Obtener dimensiones originales
            original_width, original_height = img.size
            
            # Calcular nuevas dimensiones manteniendo aspecto
            ratio = min(max_width / original_width, max_height / original_height)
            
            # Solo redimensionar si la imagen es más grande que los límites
            if ratio < 1:
                new_width = int(original_width * ratio)
                new_height = int(original_height * ratio)
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
            # Comprimir imagen
            output = io.BytesIO()
            img.save(output, format='JPEG', quality=quality, optimize=True)
            output.seek(0)
            
            # Crear nuevo archivo
            optimized_image = InMemoryUploadedFile(
                output, 'ImageField',
                f"{os.path.splitext(image_field.name)[0]}.jpg",
                'image/jpeg',
                sys.getsizeof(output),
                None
            )
            
            return optimized_image
            
        except Exception as e:
            print(f"Error optimizando imagen: {e}")
            return image_field
    
    @staticmethod
    def get_image_info(image_field):
        """
        Obtiene información sobre una imagen
        
        Args:
            image_field: ImageField de Django
            
        Returns:
            dict: Información de la imagen
        """
        try:
            img = Image.open(image_field)
            return {
                'width': img.width,
                'height': img.height,
                'format': img.format,
                'mode': img.mode,
                'size_bytes': image_field.size if hasattr(image_field, 'size') else 0
            }
        except Exception as e:
            return {'error': str(e)}
    
    @staticmethod
    def create_thumbnail(image_field, size=(150, 150)):
        """
        Crea una miniatura de la imagen
        
        Args:
            image_field: ImageField de Django
            size: Tupla (width, height) para la miniatura
            
        Returns:
            InMemoryUploadedFile: Miniatura
        """
        try:
            img = Image.open(image_field)
            
            # Convertir a RGB si es necesario
            if img.mode in ('RGBA', 'LA', 'P'):
                img = img.convert('RGB')
            
            # Crear miniatura manteniendo aspecto
            img.thumbnail(size, Image.Resampling.LANCZOS)
            
            output = io.BytesIO()
            img.save(output, format='JPEG', quality=90, optimize=True)
            output.seek(0)
            
            # Crear archivo de miniatura
            thumbnail = InMemoryUploadedFile(
                output, 'ImageField',
                f"thumb_{image_field.name}",
                'image/jpeg',
                sys.getsizeof(output),
                None
            )
            
            return thumbnail
            
        except Exception as e:
            print(f"Error creando miniatura: {e}")
            return None