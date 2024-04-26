const moment = require("moment-timezone");

const promptHora = (text) => {
    const fechaYHoraActual = moment().tz("America/La_Paz").format();
    console.log("fechaYHoraActual", fechaYHoraActual);

    return [
        { role: "system", content: "Tu eres un asistente que reserva citas medicas." },
        { role: 'system', content: `La fecha y hora actual en el sistema es: \n${fechaYHoraActual}` },
        { role: 'system', content: `Extrae la hora de la cita o reserva del siguiente texto:\n"${text}"` },
        { role: 'system', content: 'La hora extraida no debe ser igual a 00:00' },
        { role: 'system', content: 'La respuesta del horario debe estar en formato 24 horas' },
        { role: 'system', content: 'Si no existe un horario para extraer, debes retornar "{ hora: null }" ' },
        { role: 'system', content: 'La respuesta debe estar en formato JSON con la hora' }
    ];
}

module.exports = {
    promptHora
}

