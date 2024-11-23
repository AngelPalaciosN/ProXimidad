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
      nombre_completo: validateNombreCompleto(formData.nombre_completo),
      correo_electronico: validateEmail(formData.correo_electronico),
      telefono: validateTelefono(formData.telefono),
      direccion: validateDireccion(formData.direccion),
      cedula: validateCedula(formData.cedula)
    };
  
    return {
      errors,
      isValid: !Object.values(errors).some(error => error !== '')
    };
  };