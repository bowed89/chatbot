const { validaDatePrompt } = require("../utils/validateDatePrompt");
const { validateHourPrompt } = require("../utils/validateHourPrompt");

const moment = require("moment-timezone");


const validateExtractValue = (hora, nombre, fechaReserva) => {

    console.log("hora", hora.choices[0].message.content);
    console.log("fechaReservara", fechaReserva.choices[0].message.content);
    console.log("nombre", (nombre.choices[0].message.content));

    //const verificarHora = (hora.choices[0].message.content).includes(' "hora": ') ? JSON.parse(hora.choices[0].message.content).hora : null;
    const verificarHora = validateHourPrompt(hora.choices[0].message.content);
    console.log("verificarHora", verificarHora);

    // const verificarFecha = (fechaReserva.choices[0].message.content).includes(' "fecha_extraida": ') ? JSON.parse(fechaReserva.choices[0].message.content).fecha_extraida : null;

    const verificarFecha = validaDatePrompt(fechaReserva.choices[0].message.content);
    console.log("verificarFecha", verificarFecha);


    let res = {
        msg: null,
        hora: verificarHora,
        nombre: JSON.parse((nombre.choices[0].message.content)).nombre,
        apellido: JSON.parse((nombre.choices[0].message.content)).apellido,
        fecha_reserva: verificarFecha
    }

    const fechaActual = moment().tz("America/La_Paz").format("DD/MM/YYYY");
    const fechaActualDate = moment(fechaActual, "DD/MM/YYYY");
    const horaActual = moment().tz("America/La_Paz").format("HH:mm");
    const horaActualDate = moment(horaActual, "HH:mm");
    const nombreDiaActual = moment().tz("America/La_Paz").format("dddd");
    const fechaUser = moment(res.fecha_reserva, "DD/MM/YYYY");
    const horaUser = moment(res.hora, "HH:mm");
    const mediaDia = "12:00";
    const mediaDiaDate = moment(mediaDia, "HH:mm");
    const nombreDiaDomingo = moment(fechaUser).tz("America/La_Paz").format("dddd");

    // VALIDAR FECHA
    if (verificarFecha === null) {
        res.fecha_reserva = null;
        res.msg = '❌ Verifique si ingreso la fecha correctamente';
        return res;
    }

    // VALIDAR HORA
    if (verificarHora === null) {
        res.hora = null;
        res.msg = '❌ Verifique si ingreso la hora correctamente';
        return res;
    }

    if (JSON.parse((nombre.choices[0].message.content)).nombre === null || JSON.parse((nombre.choices[0].message.content)).nombre === 'null') {
        res.msg = '❌ Verifique si ingreso su nombre correctamente';
        res.nombre = null;
        return res;
    }

    if (JSON.parse((nombre.choices[0].message.content)).apellido === null || JSON.parse((nombre.choices[0].message.content)).apellido === 'null') {
        res.msg = '❌ Verifique si ingreso su apellido correctamente';
        res.apellido = null;
        return res;
    }


    // CUANDO LA FECHA DEL SISTEMA SEA IGUAL A LA QUE DIO EN CLIENTE
    // VALIDAR QUE LA HORA QUE DIO EL CLIENTE NO SEA <= A LA HORA DEL SISTEMA 
    if (fechaActualDate.isSame(fechaUser)) {
        if (horaUser.isBefore(horaActualDate) || horaUser.isSame(horaActualDate)) {
            res.msg = '❌ Debe ingresar una hora que no sea menor o igual a la hora actual';
            res.hora = null;
            return res;
        }
    }

    // VALIDAR QUE LA FECHA QUE DIO EL CLIENTE NO SEA MENOR A LA FECHA DEL SISTEMA
    if (fechaUser.isBefore(fechaActualDate)) {
        res.msg = `❌ Debe ingresar una fecha menor a la fecha actual ${fechaActual} 📅`;
        res.fecha_reserva = null;
        return res;
    }

    // VALIDAR QUE LOS SABADOS SOLAMENTE SE ATIENDA HASTA MEDIO DIA
    if (nombreDiaActual.toLowerCase() === 'saturday') {
        if (horaActualDate.isBefore(mediaDiaDate)) {
            res.msg = '🚫 Los sabados atendemos hasta medio día';
            res.fecha_reserva = null;
            return res;
        }
    }

    // VALIDAR QUE NO SE PUEDA RESERVAR CITAS PARA LOS DOMINGOS
    if (nombreDiaDomingo.toLowerCase() === 'sunday') {
        res.msg = '❌ No se puede reservar cita los domingos';
        res.fecha_reserva = null;
        return res;
    }

    return res;

}

module.exports = {
    validateExtractValue
}

