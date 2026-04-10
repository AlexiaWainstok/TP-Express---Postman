export default class alumno{

    constructor  (username,DNI,edad){

        this.username = username
        this.DNI = DNI
        this.edad = edad

    }

    toString() {
        return `Alumno: ${this.username} | DNI: ${this.DNI} | Edad: ${this.edad}`;
    }

}