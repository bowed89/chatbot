const { checkMeeting, listMeetingClient, updateMeetingClient } = require('../database/database_meeting');
const { checkIfExistsHour, checkRangeHour, } = require('../database/database_hours');
const { extraerFecha, extraerHora, extraerNombre } = require('../openai/extractValues');
const { validateExtractValue } = require('./validatePerDate');

const moment = require("moment-timezone");
const { replaceNum } = require('../utils/replaceNum');


const resultadoCita = async (whatsappPrompt, typeCase) => {

    if (typeCase === 'New') {

        console.log("whatsappPrompt ==>", whatsappPrompt);

        const hora = await extraerHora(whatsappPrompt);
        const nombre = await extraerNombre(whatsappPrompt);
        const fechaReserva = await extraerFecha(whatsappPrompt);

        return await validateExtractValue(hora, nombre, fechaReserva);

    } else if (typeCase === 'Repeating') {
        const { hora, nombre, apellido, fecha_reserva } = whatsappPrompt;
        const editPrompt = `hora: ${hora}, nombre: ${nombre} ${apellido}, fecha: ${fecha_reserva}`;

        console.log("editPrompt ==>", editPrompt);

        const editHora = await extraerHora(editPrompt);
        const editNombre = await extraerNombre(editPrompt);
        const editFechaReserva = await extraerFecha(editPrompt);

        return await validateExtractValue(editHora, editNombre, editFechaReserva);

    }

}

const validateMeeting = async (clientMeeting) => {
    let listHours = [], message;

    const { hora: hora_reserva, fecha_reserva } = clientMeeting;
    // obtengo solo la hora y suprimo los minutos  
    const hra = hora_reserva.split(':')[0];

    try {
        const res = await checkMeeting(fecha_reserva, hra);

        if (res.length === 0) return false;

        res.map((r, i) => listHours.push(`${i + 1}. ${r.horario}\n`));
        let msg = replaceNum(listHours); // convertir los numeros a simbolos.
        message = `Horarios disponibles:\nIngrese el número de la hora preferida:\n\n${(msg.toString()).replace(/,/g, '')}`

        return {
            message, res
        }

    } catch (e) {
        console.error('Error validateMeeting ==>', e);
    }

}

const validateIfExistsHour = async (hrsClient) => {
    let extractHrs;

    try {
        extractHrs = await extraerHora(hrsClient);

        // SI EL PROMPT QUE INGRESO EL USER NO LLEVA UNA HORA, LA RESP. ES MAYOR A 50 LA RESP. ESTA INVALIDA 
        if ((extractHrs.choices[0].message.content).length > 50) {
            return null;
        }

    } catch (e) {
        console.error('Error validateIfExistsHour ==>', e);
    }


    try {
        const divideHrs = (JSON.parse((extractHrs.choices[0].message.content)).hora).split(':')[0]; // 16:00 => [16, 00]
        return await checkIfExistsHour(divideHrs);

    } catch (e) {
        console.error('Error validateIfExistsHour2 ==>', e);
    }

}

const validateRangeHour = async (prompt) => {
    let extractHrs, hora1, hora2;
    let extractDate, fecha;

    // Validar si existe la hora en la tabla horario_reserva de la BD
    const res = await validateIfExistsHour(prompt);
    console.log('rees====>', res);

    if (res === null) {
        return '❌ Verifique si ingreso la hora 🕐';
    }

    if (res.length === 0) {
        return '❌ No existe el horario requerido 🕐';
    }

    // Extraer Fecha
    try {
        extractDate = await extraerFecha(prompt);
        fecha = JSON.parse((extractDate.choices[0].message.content)).fecha_extraida;

        console.log('fecha extract ==>', fecha);

    } catch (e) {
        console.error('Error validateRangeHour ==>', e);
    }
    // SI EL PROMPT QUE INGRESO EL USER NO LLEVA UNA FECHA, LA RESP. ES N/A LA RESP. ESTA INVALIDA ***
    if (fecha === 'N/A') {
        return '❌ Verifique si ingreso la hora y/o fecha correctamente';

    }
    // VALIDAR QUE NO SE PUEDA RESERVAR CITAS PARA LOS DOMINGOS CON LA FECHA QUE DIO EL CLIENTE
    const fechaUser = moment(fecha, "DD/MM/YYYY");
    const nombreDiaDomingo = moment(fechaUser).tz("America/La_Paz").format("dddd");
    console.log("extractDate1 ==>", JSON.parse((extractDate.choices[0].message.content)).fecha_extraida);

    if (nombreDiaDomingo.toLowerCase() === 'sunday') {
        return `❌ No se puede reservar citas los días domingos`;
    }
    // Extraer Hora
    try {
        extractHrs = await extraerHora(prompt);
        hora1 = (JSON.parse((extractHrs.choices[0].message.content)).hora).split(':')[0];
        hora2 = hora1 + 1;

    } catch (e) {
        console.error('Error validateRangeHour2 ==>', e);
    }

    try {
        return await checkRangeHour(fecha, hora1, hora2);

    } catch (e) {
        console.error('Error validateRangeHour3 ==>', e);
    }
}

const listMeetClient = async (num, caseNum) => {
    try {
        const res = await listMeetingClient(num);
        let msg = [];

        if (res.length > 0) {
            res.map((p, i) => msg.push(`${i + 1}. ${p.nombre} ${p.apellido}➖${p.fecha_reserva}➖${p.horario}\n`));

            if (caseNum === 'CASE_2') {
                replaceNum(msg);
                return { msg, res }
            }
            const salir = `${res.length + 1}. Menu Principal`;
            msg = [...msg, salir];
            // Reemplazar los numeros con simbolos numerales
            replaceNum(msg);

            return { msg, res }
        }

        return false;

    } catch (e) {
        console.error("Error listMeetClient ==>", e);
    }

}

const listMeetClient2 = (prompt, lengthC, arrCancel) => {
    let arr = [];
    for (let i = 1; i <= lengthC; i++) {
        arr.push(i);
    }

    // Si el num que pasa el usuario esta dentro del rango 
    if (arr.includes(Number(prompt))) {
        console.log('siiii');

        console.log('ultimo ==>', arr[arr.length - 1]);
        // si el user envia el ultimo valor del menu, volvemos al menu principal
        if ((Number(prompt)) === arr[arr.length - 1]) return 'menu';
        // apuntamos a la fila del array del array de objetos 
        const selectedRow = arrCancel[Number(prompt) - 1];
        console.log('id ==>' + typeof selectedRow?.id_reserva);

        return selectedRow;

    }

    return 'menu';
}

const listMeetClient3 = async (id) => {
    try {
        return await updateMeetingClient(id);

    } catch (e) {
        console.error('Error listMeetClient3 ==>', e);
    }
}


module.exports = {
    resultadoCita,
    validateMeeting,
    validateRangeHour,
    listMeetClient,
    listMeetClient2,
    listMeetClient3
}