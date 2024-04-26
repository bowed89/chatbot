const moment = require("moment-timezone");

const promptFechas = (text) => {
    const fechaYHoraActual = moment().tz("America/La_Paz").format("LLLL");
    console.log("fechaActual ==>", fechaYHoraActual);
    const nombreDiaActual = moment().tz("America/La_Paz").format("dddd");
    console.log(nombreDiaActual);


    // proximo lunes
    const proximoLunes = moment().tz("America/La_Paz").day(1).add(7, 'days').format("DD/MM/YYYY");
    const esteLunes = moment().tz("America/La_Paz").day(1).format("DD/MM/YYYY");

    // proximo martes
    const proximoMartes = moment().tz("America/La_Paz").day(2).add(7, 'days').format("DD/MM/YYYY");
    const esteMartes = moment().tz("America/La_Paz").day(2).format("DD/MM/YYYY");

    console.log("proximoMartes===>", proximoMartes);

    // proximo miercoles
    const proximoMiercoles = moment().tz("America/La_Paz").day(3).add(7, 'days').format("DD/MM/YYYY");
    const esteMiercoles = moment().tz("America/La_Paz").day(3).format("DD/MM/YYYY");

    // proximo jueves
    const proximoJueves = moment().tz("America/La_Paz").day(4).add(7, 'days').format("DD/MM/YYYY");
    const esteJueves = moment().tz("America/La_Paz").day(4).format("DD/MM/YYYY");

    // proximo viernes, day(5) establece el quinto dia que es viernes y lo agrega una semana mas, osea proximo viernes.
    const proximoViernes = moment().tz("America/La_Paz").day(5).add(7, 'days').format("DD/MM/YYYY");
    const esteViernes = moment().tz("America/La_Paz").day(5).format("DD/MM/YYYY");

    // proximo sabado
    const proximoSabado = moment().tz("America/La_Paz").day(6).add(7, 'days').format("DD/MM/YYYY");
    const esteSabado = moment().tz("America/La_Paz").day(6).format("DD/MM/YYYY");

    // proximo domingo
    const proximoDomingo = moment().tz("America/La_Paz").day(7).add(7, 'days').format("DD/MM/YYYY");
    const esteDomingo = moment().tz("America/La_Paz").day(7).format("DD/MM/YYYY");

    return [
        { role: "system", content: `Tu eres un asistente que reserva citas medicas del prompt: "${text}"` },
        { role: 'system', content: `La fecha y hora actual en el sistema es: "${fechaYHoraActual}"` },
        { role: 'system', content: `Extrae la fecha de la cita o reserva del siguiente prompt: "${text}"` },
        { role: 'system', content: 'El formato de la fecha extraida debe ser "DD/MM/AAAA" ' },
        {
            role: 'user', content: `
                                         Ejemplo 1: reservar para el 5 de enero, fecha extraida: "{ fecha_extraida: 05/01/2024 }", obtener el año de la fecha actual "${fechaYHoraActual}".
                                         Ejemplo 2: reservar para el 5/01, fecha extraida: "{ fecha_extraida: 05/01/2024 }", obtener el año de la fecha actual "${fechaYHoraActual}".
                                         Ejemplo 3: reservar para el 5/1/24, fecha extraida: "{ fecha_extraida: 05/01/2024 }", obtener el año de la fecha actual "${fechaYHoraActual}".
                                         
            ` },
        { role: 'system', content: `Si el paciente ingresa una fecha anterior a la fecha actual: "${fechaYHoraActual}", debes retornar  "{ fecha_extraida: null }" ` },
        { role: 'system', content: 'Si no existe una fecha para extraer, debes retornar "{ fecha_extraida: null }" ' },
        { role: 'system', content: 'La respuesta debe estar en formato JSON con la fecha_extraida' }


    ]
    /* 
        return [
            { role: "system", content: `Tu eres un asistente que extrae fechas exactas del texto: "${text}"` },
            { role: 'system', content: `La fecha y hora actual en el sistema es: "${fechaYHoraActual}"` },
            { role: 'system', content: `El dia de hoy es: "${nombreDiaActual}"` },
            { role: 'user', content: 'Quiero agendar algo para este domingo.' }, //
            { role: 'assistant', content: `Calcular la fecha exacta considerando el texto: "para este domingo" y considerando la fecha actual: "${fechaYHoraActual}"` }, //
            { role: 'user', content: 'Quiero agendar algo para este sabado.' }, //
            { role: 'assistant', content: `Calcular la fecha exacta considerando el texto: "para este sabado" y considerando la fecha actual: "${fechaYHoraActual}"` }, //
            { role: 'user', content: 'Quiero reservar para el lunes.' }, // este lunes
            { role: 'assistant', content: `Entender y extraer la fecha del texto "Quiero reservar para el lunes".` }, // este lunes
            { role: 'user', content: `El lunes es ${esteLunes}.` }, // este lunes
            { role: 'user', content: 'Quiero reservar para el martes.' }, // este martes
            { role: 'assistant', content: `Entender y extraer la fecha del texto "Quiero reservar para el martes".` }, // este martes
            { role: 'user', content: `El martes es ${esteMartes}.` }, // este martes
            { role: 'user', content: 'Quiero reservar para el miercoles.' }, // este miercoles
            { role: 'assistant', content: `Entender y extraer la fecha del texto "Quiero reservar para el miercoles".` }, // este miercoles
            { role: 'user', content: `El miercoles es ${esteMiercoles}.` }, // este miercoles
            { role: 'user', content: 'Quiero reservar para el jueves.' }, // este jueves
            { role: 'assistant', content: `Entender y extraer la fecha del texto "Quiero reservar para el jueves".` }, // este jueves
            { role: 'user', content: `El jueves es ${esteJueves}.` }, // este jueves
            { role: 'user', content: 'Quiero reservar para el viernes.' }, // este viernes
            { role: 'assistant', content: `Entender y extraer la fecha del texto "Quiero reservar para el viernes".` }, // este viernes
            { role: 'user', content: `El viernes es ${esteViernes}.` }, // este viernes
            { role: 'user', content: 'Quiero reservar para sabado.' }, // este sabado
            { role: 'assistant', content: `Entender y extraer la fecha del texto "Quiero reservar para sabado".` }, // este sabado
            { role: 'user', content: `El sabado es ${esteSabado}.` }, // este sabado
            { role: 'user', content: 'Quiero reservar para el domingo.' }, // este domingo
            { role: 'assistant', content: `Entender y extraer la fecha del texto "Quiero reservar para el domingo".` }, // este domingo
            { role: 'user', content: `El domingo es ${esteDomingo}.` }, // este domingo
            { role: 'user', content: 'Quiero reservar para el proximo lunes.' }, // proximo lunes
            { role: 'assistant', content: `Entender y extraer la fecha del texto "Quiero reservar para el proximo lunes".` }, // proximo lunes
            { role: 'user', content: `El proximo lunes es el ${proximoLunes}.` }, // proximo lunes
            { role: 'user', content: 'Quiero reservar para el proximo martes.' }, // proximo martes
            { role: 'assistant', content: `Entender y extraer la fecha del texto "Quiero reservar para el proximo martes".` }, // proximo martes
            { role: 'user', content: `El proximo martes es el ${proximoMartes}.` }, // proximo martes
            { role: 'user', content: 'Quiero reservar para el proximo miercoles.' }, // proximo miercoles
            { role: 'assistant', content: `Entender y extraer la fecha del texto "Quiero reservar para el proximo miercoles".` }, // proximo miercoles
            { role: 'user', content: `El proximo miercoles es el ${proximoMiercoles}.` }, // proximo miercoles
            { role: 'user', content: 'Quiero reservar para el proximo jueves.' }, // proximo jueves
            { role: 'assistant', content: `Entender y extraer la fecha del texto "Quiero reservar para el proximo jueves".` }, // proximo jueves
            { role: 'user', content: `El proximo jueves es el ${proximoJueves}.` }, // proximo jueves
            { role: 'user', content: 'Quiero reservar para el proximo viernes.' }, // proximo viernes
            { role: 'assistant', content: `Entender y extraer la fecha del texto "Quiero reservar para el proximo viernes".` }, // proximo viernes
            { role: 'user', content: `El proximo viernes es el ${proximoViernes}.` }, // proximo viernes
            { role: 'user', content: 'Quiero reservar para el proximo sabado.' }, // proximo sabado
            { role: 'assistant', content: `Entender y extraer la fecha del texto "Quiero reservar para el proximo sabado".` }, // proximo sabado
            { role: 'user', content: `El proximo sabado es el ${proximoSabado}.` }, // proximo sabado
            { role: 'user', content: 'Quiero reservar para el proximo domingo.' }, // proximo domingo
            { role: 'assistant', content: `Entender y extraer la fecha del texto "Quiero reservar para el proximo domingo".` }, // proximo domingo
            { role: 'user', content: `El proximo domingo es el ${proximoDomingo}.` }, // proximo domingo
            { role: 'system', content: `Calcular la fecha extraida tomando en cuenta la fecha y hora actual del sistema: "${fechaYHoraActual}", con la fecha de reserva del siguiente texto: \n"${text}" ` },
            { role: 'system', content: 'Si no existe una fecha para extraer, debes retornar "{ fecha_extraida: null }" ' },
            { role: 'system', content: `Si el prompt:"${text}" no tiene una fecha, debes retornar "{ fecha_extraida: null }" ` },
            {
                role: 'user', content: `
                                         Ejemplo 1: Reservar para Juana Perez a las 3PM, fecha extraida: "{ fecha_extraida: null }, no debes extraer la fecha actual "${fechaYHoraActual}"".
                                         Ejemplo 2: reservar para el 5/01, fecha extraida: "{ fecha_extraida: 05/01/2024 }", obtener el año de la fecha actual "${fechaYHoraActual}".
                                         Ejemplo 3: reservar para el 5/1/24, fecha extraida: "{ fecha_extraida: 05/01/2024 }", obtener el año de la fecha actual "${fechaYHoraActual}".
                                         
            ` },
            { role: 'system', content: 'La respuesta debe estar en formato JSON con la fecha_actual (DD/MM/AAAA) y la fecha_extraida (DD/MM/AAAA) y los dias_totales_del_mes' }
        ]; */
}



module.exports = {
    promptFechas
}

