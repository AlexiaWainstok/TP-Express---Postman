import axios from "axios";
const APIKEY = "ba4b8e59"; 
  
const OMDBSearchByPage = async (searchText, page = 1) => { 
let returnObject = {
respuesta : false,
cantidadTotal : 0,
datos : []
};
try {
    const url = `http://www.omdbapi.com/?apikey=${APIKEY}&s=${searchText}&page=${page}`;
    const response = await axios.get(url);

    if (response.data.Response === "True") {
      returnObject.respuesta = true;
      returnObject.cantidadTotal = parseInt(response.data.totalResults);
      returnObject.datos = response.data.Search;
    }

  } catch (error) {
    console.log(error);
  }

return returnObject;
};


const OMDBSearchComplete = async (searchText) => { 
let returnObject = {
respuesta : false,
cantidadTotal : 0,
datos : []
};

  try {
  
    const firstPage = await OMDBSearchByPage(searchText, 1);

    if (!firstPage.respuesta) return returnObject;

    returnObject.respuesta = true;
    returnObject.cantidadTotal = firstPage.cantidadTotal;
    returnObject.datos = [...firstPage.datos];

    const totalPages = Math.ceil(firstPage.cantidadTotal / 10);

  
    for (let i = 2; i <= totalPages; i++) {
      const pageData = await OMDBSearchByPage(searchText, i);
      returnObject.datos.push(...pageData.datos);
    }

  } catch (error) {
    console.log(error);
  }
return returnObject;
};


const OMDBGetByImdbID = async (imdbID) => { 
let returnObject = {
respuesta : false,
cantidadTotal : 0,
datos : {}
};

  try {
    const url = `http://www.omdbapi.com/?apikey=${APIKEY}&i=${imdbID}`;
    const response = await axios.get(url);

    if (response.data.Response === "True") {
      returnObject.respuesta = true;
      returnObject.datos = response.data;
      returnObject.cantidadTotal = 1;
    }

  } catch (error) {
    console.log(error);
  }

return returnObject;
};

export {OMDBSearchByPage, OMDBSearchComplete, OMDBGetByImdbID};