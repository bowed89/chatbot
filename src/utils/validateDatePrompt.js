const moment = require("moment-timezone");

const validaDatePrompt = (prompt) => {
    // Expresión regular para buscar el formato de fecha en el string
    const regex = /\b\d{2}\/\d{2}\/\d{4}\b/;

    // Buscar el formato de fecha en el string
    const match = prompt.match(regex);

    if (match) {
        const fecha = match[0]; // obtenemos la  fecha "02/05/2024"
        const validarFecha = moment(fecha, "DD/MM/YYYY", true);
        const esValidaFecha = validarFecha.isValid();

        return esValidaFecha ? fecha : null;

    }

    return null;

}

module.exports = {
    validaDatePrompt
}

