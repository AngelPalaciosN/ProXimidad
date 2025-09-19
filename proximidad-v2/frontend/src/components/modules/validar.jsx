export const validateNombreCompleto = (nombre) => {
    if (!nombre.trim()) {
      return 'El nombre completo es requerido';
    }
    if (nombre.length < 3) {
      return 'El nombre debe tener al menos 3 caracteres';
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
      return 'El nombre solo debe contener letras';
    }
    return '';
  };
  
  export const validateEmail = (email) => {
    if (!email) {
      return 'El correo electrónico es requerido';
    }
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return 'Ingrese un correo electrónico válido';
    }
    return '';
  };
  
  export const validateTelefono = (telefono) => {
    if (!telefono) {
      return 'El teléfono es requerido';
    }
    if (!/^\d{10}$/.test(telefono)) {
      return 'El teléfono debe tener 10 dígitos';
    }
    return '';
  };
  
  export const validateDireccion = (direccion) => {
    if (!direccion.trim()) {
      return 'La dirección es requerida';
    }
    if (direccion.length < 5) {
      return 'La dirección debe tener al menos 5 caracteres';
    }
    return '';
  };
  
  export const validateCedula = (cedula) => {
    if (!cedula.trim()) {
      return 'La cédula es requerida';
    }
    if (!/^\d{10}$/.test(cedula)) {
      return 'La cédula debe tener 10 dígitos';
    }
    return '';
  };
  
export const validateForm = (formData) => {
    const errors = {
      nombre_completo: formData.nombre_completo ? validateNombreCompleto(formData.nombre_completo) : '',
      correo_electronico: formData.correo_electronico ? validateEmail(formData.correo_electronico) : '',
      telefono: formData.telefono ? validateTelefono(formData.telefono) : '',
      direccion: formData.direccion ? validateDireccion(formData.direccion) : '',
      cedula: formData.cedula ? validateCedula(formData.cedula) : ''
    };
  
    return {
      errors,
      isValid: !Object.values(errors).some(error => error !== '')
    };
  };


  // Función para validar que la imagen sea JPG
export const validateImage = (file) => {
  // Si no hay archivo, es válido porque la imagen es opcional
  if (!file) return '';
  
  // Verificar el tipo de archivo
  if (!file.type || !file.type.startsWith('image/jpeg')) {
    return 'Solo se permiten imágenes en formato JPG/JPEG';
  }
  
  // Verificar tamaño (opcional, limitando a 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return 'La imagen no debe exceder los 5MB';
  }
  
  return '';
};
