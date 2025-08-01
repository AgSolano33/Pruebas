// Función para sanitizar strings y remover caracteres problemáticos
export function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  
  // Solo remover caracteres que realmente causan problemas con btoa
  // Mantener acentos y caracteres españoles que están en el rango Latin1
  return str
    .replace(/[^\x00-\xFF\s\-.,!?()]/g, '') // Solo caracteres Latin1 (0-255) y algunos símbolos seguros
    .trim();
}

// Función para sanitizar arrays de strings
export function sanitizeArray(arr) {
  if (!Array.isArray(arr)) return arr;
  return arr.map(item => sanitizeString(item)).filter(item => item);
}

// Función para sanitizar objetos
export function sanitizeObject(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = sanitizeArray(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

// Función para validar que un string sea seguro para btoa
export function isSafeForBtoa(str) {
  if (typeof str !== 'string') return true;
  
  // Verificar si contiene caracteres fuera del rango Latin1
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 255) {
      return false;
    }
  }
  return true;
}

// Función para hacer un string seguro para btoa
export function makeSafeForBtoa(str) {
  if (typeof str !== 'string') return str;
  
  // Solo remover caracteres fuera del rango Latin1 (0-255)
  // Mantener todos los caracteres españoles que están en Latin1
  return str
    .split('')
    .map(char => {
      const code = char.charCodeAt(0);
      if (code <= 255) {
        return char; // Mantener caracteres Latin1 (incluye acentos españoles)
      }
      return '?'; // Solo reemplazar caracteres fuera de Latin1
    })
    .join('');
} 