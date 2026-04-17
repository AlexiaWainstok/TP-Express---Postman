// src/modules/validaciones-helper.js
class ValidacionesHelper {

  getIntegerOrDefault = (value, defaultValue) => {
    const numero = parseInt(value);
    return isNaN(numero) ? defaultValue : numero;
  };


  getStringOrDefault = (value, defaultValue) => {
    if (value === null || value === undefined) return defaultValue;
    return value.toString();
  };

  getDateOrDefault = (value, defaultValue) => {
    if (value === null || value === undefined) return defaultValue;
    const fecha = new Date(value);
    return isNaN(fecha.getTime()) ? defaultValue : fecha;
  };

   
  getBooleanOrDefault = (value, defaultValue) => {
    if (value === "true" || value === true) return true;
    if (value === "false" || value === false) return false;
    return defaultValue;
  };

  isEmail = (value) => {
    if (!value) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

}

// 👇 MUY IMPORTANTE (esto es lo que te pide el TP)
export default new ValidacionesHelper();