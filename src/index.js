import express  from "express"; // hacer npm i express
import cors     from "cors";    // hacer npm i cors

import {OMDBSearchByPage, OMDBSearchComplete, OMDBGetByImdbID} from "./modules/omdb-wrapper.js"
import Alumno from "./models/alumno.js"
import {sumar, restar, multiplicar, dividir} from "./modules/matematica.js"
import ValidacionesHelper from "./modules/validaciones-helper.js"
import DateTimeHelper from "./modules/datetime-helper.js"

const app  = express();
const port = 3000;             


app.use(cors());         
app.use(express.json()); 


app.get('/', (req, res) => {
    res.status(200).send('¡Ya estoy respondiendo!');
});

app.get('/saludar/:nombre', (req, res) => {
    const nombre = ValidacionesHelper.getStringOrDefault(req.params.nombre, 'Anónimo');
    res.status(200).send(`Hola ${nombre}`);
    console.log("lesan")
});

app.get('/validarfecha/:ano/:mes/:dia', (req, res) => {

  const ano = ValidacionesHelper.getIntegerOrDefault(req.params.ano, 0);
  const mes = ValidacionesHelper.getIntegerOrDefault(req.params.mes, 0);
  const dia = ValidacionesHelper.getIntegerOrDefault(req.params.dia, 0);


  if (ano === 0 || mes === 0 || dia === 0) {
    return res.status(400).send("Parámetros inválidos");
  }

  const fecha = new Date(ano, mes - 1, dia);

  if (isNaN(fecha.getTime())) {
    return res.status(400).send("Fecha inválida");
  }

  res.status(200).send("Fecha válida");
});


app.get('/matematica/sumar', (req, res) => {
  const n1 = ValidacionesHelper.getIntegerOrDefault(req.query.n1, null);
  const n2 = ValidacionesHelper.getIntegerOrDefault(req.query.n2, null);

  if (n1 === null || n2 === null) {
    return res.status(400).send('n1 y n2 deben ser números enteros');
  }

  res.status(200).send({ resultado: sumar(n1, n2) });
});

app.get('/matematica/restar', (req, res) => {
   const n1 = ValidacionesHelper.getIntegerOrDefault(req.query.n1, null);
    const n2 = ValidacionesHelper.getIntegerOrDefault(req.query.n2, null);
    res.status(200).send({ resultado: restar(Number(n1), Number(n2)) });
});

app.get('/matematica/multiplicar', (req, res) => {
    const n1 = ValidacionesHelper.getIntegerOrDefault(req.query.n1, null);
    const n2 = ValidacionesHelper.getIntegerOrDefault(req.query.n2, null);
    res.status(200).send({ resultado: multiplicar(Number(n1), Number(n2)) });
});

app.get('/matematica/dividir', (req, res) => {
     const n1 = ValidacionesHelper.getIntegerOrDefault(req.query.n1, null);
    const n2 = ValidacionesHelper.getIntegerOrDefault(req.query.n2, null);

    if (Number(n2) === 0) {
        return res.status(400).send("El divisor no puede ser cero");
    }

    res.status(200).send({ resultado: dividir(Number(n1), Number(n2)) });
});


function armarEnvelope(datos) {
  if (!datos || datos.respuesta === false) {
    return {
      respuesta: false,
      cantidadTotal: 0,
      datos: Array.isArray(datos?.datos) ? [] : {}
    };
  }

  return datos;
}
app.get('/omdb/searchbypage', async (req, res) => {
  try {
    const search = ValidacionesHelper.getStringOrDefault(req.query.search, '');
    const p      = ValidacionesHelper.getIntegerOrDefault(req.query.p, 1);

    const data = await OMDBSearchByPage(search, p);

    res.status(200).send(armarEnvelope(data));
  } catch {
    res.status(500).send(armarEnvelope(null));
  }
});

app.get('/omdb/searchcomplete', async (req, res) => {
  try {
    const search = ValidacionesHelper.getStringOrDefault(req.query.search, '');

    if (search === '') {
      return res.status(400).send('search es obligatorio');
    }

    const data = await OMDBSearchComplete(search);

    res.status(200).send(armarEnvelope(data));
  } catch {
    res.status(500).send(armarEnvelope(null));
  }
});

app.get('/omdb/getbyomdbid', async (req, res) => {
  try {
    const imdbID = ValidacionesHelper.getStringOrDefault(req.query.imdbID, '');

    if (imdbID === '') {
      return res.status(400).send('imdbID es obligatorio');
    }

    const data = await OMDBGetByImdbID(imdbID);

    res.status(200).send(armarEnvelope(data));
  } catch {
    res.status(500).send(armarEnvelope(null));
  }
});


const alumnosArray = [];

alumnosArray.push(new Alumno("Esteban Dido", "22888444", 20));
alumnosArray.push(new Alumno("Matias Queroso", "28946255", 51));
alumnosArray.push(new Alumno("Elba Calao", "32623391", 18));

app.get('/alumnos', (req, res) => {
    res.status(200).send(alumnosArray);
});

app.get('/alumnos/:dni', (req, res) => {
  const dni = ValidacionesHelper.getStringOrDefault(req.params.dni, '');

  const alumno = alumnosArray.find(item => item.dni === dni);

  if (!alumno) {
    return res.status(404).send("Alumno no encontrado");
  }

  res.status(200).send(alumno);
});

app.post('/alumnos', (req, res) => {
  const username = ValidacionesHelper.getStringOrDefault(req.body.username, '');
  const dni      = ValidacionesHelper.getStringOrDefault(req.body.dni, '');
  const edad     = ValidacionesHelper.getIntegerOrDefault(req.body.edad, 0);


  if (username === '' || dni === '' || edad <= 0) {
    return res.status(400).send('username, dni y edad son obligatorios');
  }

  alumnosArray.push(new Alumno(username, dni, edad));

  res.status(201).send("Alumno agregado");
});

app.delete('/alumnos', (req, res) => {
  const dni = ValidacionesHelper.getStringOrDefault(req.body.dni, '');

  const index = alumnosArray.findIndex(item => item.dni === dni);

  if (index === -1) {
    return res.status(404).send("Alumno no encontrado");
  }

  alumnosArray.splice(index, 1);

  res.status(200).send("Alumno eliminado");
});

app.get('/fechas/isDate', (req, res) => {
  const fecha = ValidacionesHelper.getDateOrDefault(req.query.fecha, null);

  const esValida = DateTimeHelper.isDate(fecha);

  res.status(200).send({ valido: esValida });
});

app.get('/fechas/getEdadActual', (req, res) => {
  const fechaNac = ValidacionesHelper.getDateOrDefault(req.query.fechaNacimiento, null);

  if (!DateTimeHelper.isDate(fechaNac)) {
    return res.status(400).send('Fecha inválida');
  }

  res.status(200).send({
    edad: DateTimeHelper.getEdadActual(fechaNac)
  });
});

app.get('/fechas/getDiasHastaMiCumple', (req, res) => {
  const fechaNac = ValidacionesHelper.getDateOrDefault(req.query.fechaNacimiento, null);

  if (!DateTimeHelper.isDate(fechaNac)) {
    return res.status(400).send('Fecha inválida');
  }

  res.status(200).send({
    diasRestantes: DateTimeHelper.getDiasHastaMiCumple(fechaNac)
  });
});


app.get('/fechas/getDiaTexto', (req, res) => {
  const fecha = ValidacionesHelper.getDateOrDefault(req.query.fecha, null);
  const abr = ValidacionesHelper.getBooleanOrDefault(req.query.abr, false);

  if (!DateTimeHelper.isDate(fecha)) {
    return res.status(400).send('Fecha inválida');
  }

  res.status(200).send({
    dia: DateTimeHelper.getDiaTexto(fecha, abr)
  });
});

app.get('/fechas/getMesTexto', (req, res) => {
  const fecha = ValidacionesHelper.getDateOrDefault(req.query.fecha, null);
  const abr = ValidacionesHelper.getBooleanOrDefault(req.query.abr, false);

  if (!DateTimeHelper.isDate(fecha)) {
    return res.status(400).send('Fecha inválida');
  }

  res.status(200).send({
    mes: DateTimeHelper.getMesTexto(fecha, abr)
  });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
})
