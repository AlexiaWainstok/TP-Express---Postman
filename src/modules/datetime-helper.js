class DateTimeHelper {

  isDate = (fecha) => {
    return fecha instanceof Date && !isNaN(fecha.getTime());
  };

  getOnlyDate = (fecha = new Date()) => {
    if (!this.isDate(fecha)) return null;

    const copia = new Date(fecha);
    copia.setHours(0, 0, 0, 0);
    return copia;
  };

  getEdadActual = (fechaNacimiento) => {
    if (!this.isDate(fechaNacimiento)) return -1;

    const hoy = new Date();

    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();

    const mesActual = hoy.getMonth();
    const diaActual = hoy.getDate();

    const mesNac = fechaNacimiento.getMonth();
    const diaNac = fechaNacimiento.getDate();

    if (
      mesActual < mesNac ||
      (mesActual === mesNac && diaActual < diaNac)
    ) {
      edad--;
    }

    return edad;
  };

  getDiasHastaMiCumple = (fechaNacimiento) => {
    if (!this.isDate(fechaNacimiento)) return -1;

    const hoy = new Date();

    let proximoCumple = new Date(
      hoy.getFullYear(),
      fechaNacimiento.getMonth(),
      fechaNacimiento.getDate()
    );

    if (proximoCumple < hoy) {
      proximoCumple.setFullYear(hoy.getFullYear() + 1);
    }

    const diferenciaMs = proximoCumple - hoy;
    const dias = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));

    return dias;
  };

  getDiaTexto = (fecha, retornarAbreviacion = false) => {
    if (!this.isDate(fecha)) return null;

    const dias = ["Domingo", "Lunes", "Martes", "Miércoles",
                  "Jueves", "Viernes", "Sábado"];

    const dia = dias[fecha.getDay()];

    return retornarAbreviacion ? dia.slice(0, 3) : dia;
  };

  getMesTexto = (fecha, retornarAbreviacion = false) => {
    if (!this.isDate(fecha)) return null;

    const meses = ["Enero", "Febrero", "Marzo", "Abril",
                   "Mayo", "Junio", "Julio", "Agosto",
                   "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const mes = meses[fecha.getMonth()];

    return retornarAbreviacion ? mes.slice(0, 3) : mes;
  };

}

export default new DateTimeHelper();