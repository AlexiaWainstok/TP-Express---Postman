import express  from "express"; // hacer npm i express
import cors     from "cors";    // hacer npm i cors

import Alumno from "./models/alumno.js"
import {sumar, restar, multiplicar, dividir} from "./modules/matematica.js"
import {OMDBSearchByPage, OMDBSearchComplete, OMDBGetByImdbID} from "./modules/omdb-wrapper.js"

const app  = express();
const port = 3000;             


app.use(cors());         
app.use(express.json()); 


app.get('/', (req, res) => {
    res.status(200).send('¡Ya estoy respondiendo!');
});

app.get('/saludar/:nombre', (req, res) => {
    const nombre = req.params.nombre;
    res.status(200).send(`Hola ${nombre}`);
    console.log("lesan")
});


app.get('/validarfecha/:ano/:mes/:dia', (req, res) => {
    const { ano, mes, dia } = req.params;

    const fecha = `${ano}-${mes}-${dia}`;

    if (isNaN(Date.parse(fecha))) {
        return res.status(400).send("Fecha inválida");
    }

    res.status(200).send("Fecha válida");
});


app.get('/matematica/sumar', (req, res) => {
    const { n1, n2 } = req.query;
    res.status(200).send({ resultado: sumar(Number(n1), Number(n2)) });
});

app.get('/matematica/restar', (req, res) => {
    const { n1, n2 } = req.query;
    res.status(200).send({ resultado: restar(Number(n1), Number(n2)) });
});

app.get('/matematica/multiplicar', (req, res) => {
    const { n1, n2 } = req.query;
    res.status(200).send({ resultado: multiplicar(Number(n1), Number(n2)) });
});

app.get('/matematica/dividir', (req, res) => {
    const { n1, n2 } = req.query;

    if (Number(n2) === 0) {
        return res.status(400).send("El divisor no puede ser cero");
    }

    res.status(200).send({ resultado: dividir(Number(n1), Number(n2)) });
});



app.get('/omdb/searchbypage', async (req, res) => {
    const { search, p } = req.query;

    const datos = await OMDBSearchByPage(search, p);

    res.status(200).send({
        respuesta: datos.length > 0,
        cantidadTotal: datos.length,
        datos: datos
    });
});

app.get('/omdb/searchcomplete', async (req, res) => {
    const { search } = req.query;

    const datos = await OMDBSearchComplete(search);

    res.status(200).send({
        respuesta: datos.length > 0,
        cantidadTotal: datos.length,
        datos: datos
    });
});

app.get('/omdb/getbyomdbid', async (req, res) => {
    const { imdbID } = req.query;

    const datos = await OMDBGetByImdbID(imdbID);

    res.status(200).send({
        respuesta: datos ? true : false,
        cantidadTotal: datos ? 1 : 0,
        datos: datos
    });
});



const alumnosArray = [];

alumnosArray.push(new Alumno("Esteban Dido", "22888444", 20));
alumnosArray.push(new Alumno("Matias Queroso", "28946255", 51));
alumnosArray.push(new Alumno("Elba Calao", "32623391", 18));

app.get('/alumnos', (req, res) => {
    res.status(200).send(alumnosArray);
});

app.get('/alumnos/:dni', (req, res) => {
    const alumno = alumnosArray.find(a => a.dni === req.params.dni);

    if (!alumno) {
        return res.status(404).send("Alumno no encontrado");
    }

    res.status(200).send(alumno);
});

app.post('/alumnos', (req, res) => {
    const { username, dni, edad } = req.body;

    alumnosArray.push(new Alumno(username, dni, edad));

    res.status(201).send("Alumno agregado");
});

app.delete('/alumnos', (req, res) => {
    const { dni } = req.body;

    const index = alumnosArray.findIndex(a => a.dni === dni);

    if (index === -1) {
        return res.status(404).send("Alumno no encontrado");
    }

    alumnosArray.splice(index, 1);

    res.status(200).send("Alumno eliminado");
});





app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
})
