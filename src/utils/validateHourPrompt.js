const moment = require("moment-timezone");

const validateHourPrompt = (prompt) => {
    // Expresión regular para buscar el formato de hora en el string
    const regex = /\b\d{1,2}:\d{2}\b/;

    // Buscar el formato de hora en el string
    const match = prompt.match(regex);

    if (match) {
        const hora = match[0]; // obtenemos la hora 12:00
        const validarHora = moment(hora, 'HH:mm', true);
        const esValidaHora = validarHora.isValid();

        return esValidaHora && hora !== "00:00" ? hora : null;

    }

    return null;

}

module.exports = {
    validateHourPrompt
}

