const { saveMeeting } = require('../database/database_meeting');
const { whatsappMsg } = require('../whatsapp/whatsapp-web');
const { resultadoCita, validateMeeting, validateRangeHour, listMeetClient, listMeetClient2, listMeetClient3 } = require('../validators/validate');

const { v4: uuidv4 } = require('uuid'); // Para generar identificadores únicos
const activeConversations = new Map(); // Almacena las conversaciones activ`as por identificador único

const removeAccents = (text) => {
    return text
        .normalize('NFD')
        .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi, "$1")
        .normalize();
}

const States = {
    INITIAL: 'INITIAL', WAITING_DATA_CLIENT: 'WAITING_DATA_CLIENT',
    WAITING_MENU_NUMBER: 'WAITING_MENU_NUMBER', WAITING_SELECT_HOUR: 'WAITING_SELECT_HOUR',
    WAITING_CONFIRM_MEETING: 'WAITING_CONFIRM_MEETING', WAITING_DATE_AVAILABLE: 'WAITING_DATE_AVAILABLE',
    WAITING_CANCEL_MEET: 'WAITING_CANCEL_MEET', WAITING_CANCEL_MEET2: 'WAITING_CANCEL_MEET2',
    WAITING_COMPLETE_DATA_CLIENT: 'WAITING_COMPLETE_DATA_CLIENT'
};

const chatbotController = async () => {
    let whatsappPrompt, tempAvailableHours, tempDataClient, chatId, lengthCancel, arrayCancel, idCancelMeet, resCita, resCitaKey, resCitaMsg = 'New';

    const passValues = (values1, values2) => {
        tempAvailableHours = values1;
        tempDataClient = values2;
    };

    const lengthCancelMeet = (size, arr) => {
        lengthCancel = size;
        arrayCancel = arr;
    }

    try {

        const { client, qrEmitter } = await whatsappMsg();

        qrEmitter.on('qrGenerated', (url) => {
            console.log('QR code generated as base64:', url);
        });

        client.on('message', async (message) => {
            chatId = message.from; // Obtener el número del remitente

            if (!activeConversations.has(chatId)) {
                const uniqueId = uuidv4(); // Generar un identificador único
                activeConversations.set(chatId, {
                    id: uniqueId,
                    state: States.INITIAL // Estado inicial de la conversación
                });
            }

            const conversation = activeConversations.get(chatId);
            whatsappPrompt = await removeAccents(message.body);

            const mainMenu = () => {
                client.sendMessage(message.from, `Bienvenido/a \nGracias por contactarse con nuestro CHATBOT 🤖
                \nIngrese el número del menú para iniciar su operación:
                \n 1⃣ Reservar\n 2⃣ Ver mis reservas\n 3⃣ Cancelar reserva\n 4⃣ Ver horarios disponibles`);
                conversation.state = States.WAITING_MENU_NUMBER;
            }

            const completeData = () => {
                Object.keys(resCita).forEach(key => {
                    if (resCita[key] === null) {
                        resCitaKey = key;
                    }
                });

                client.sendMessage(message.from, `❌Complete los datos solicitados \n❗Ingrese nuevamente su ${resCitaKey}`);
                conversation.state = States.WAITING_COMPLETE_DATA_CLIENT;
            }

            const ifNotNull = async () => {
                console.log('no hay nulls');
                if (resCitaMsg === 'Repeating') {
                    resCita = await resultadoCita(resCita, resCitaMsg);
                }

                console.log('llenamos resCita luego de nulls +++ ', resCita);
                const { hora, nombre, apellido, fecha_reserva } = resCita;

                // Si vuelve a tener nulls porq no ingreso bien los datos retorna al menu principal
                if (hora === null || nombre === null || apellido === null || fecha_reserva === null) {
                    resCita = null;
                    resCitaMsg = 'New';
                    client.sendMessage(message.from, `❌ Su reserva no fué realizada!\n❗No ingreso los datos solicitados correctamente`);

                    return mainMenu();
                }

                //resCita = JSON.parse(JSON.stringify(resCita));
                resCita.numero_cel = (message.from).split('@')[0];

                console.log('resCita con el num cel =>', resCita);


                // VERIFICAR DISPONIBILIDAD DE LA HORA Y FECHA QUE REQUIERE EL USUARIO
                try {
                    let resHoursAvailables = await validateMeeting(resCita);
                    console.log("resHoursAvailables ==>", resHoursAvailables);
                    if (!resHoursAvailables) {
                        client.sendMessage(message.from, `❌ Su reserva no fué realizada!\nEl horario para las ${resCita.hora} de fecha ${resCita.fecha_reserva} no se encuentra disponible.`);
                        resCita = null;
                        return mainMenu();
                    }

                    if (resHoursAvailables.res.length > 0) {
                        passValues(resHoursAvailables.res, resCita);
                        client.sendMessage(message.from, resHoursAvailables.message);
                        return conversation.state = States.WAITING_SELECT_HOUR;
                    }

                } catch (e) { console.error(e); }

            }



            switch (conversation.state) {
                case States.INITIAL:
                    mainMenu();
                    break;

                case States.WAITING_MENU_NUMBER:
                    switch (whatsappPrompt) {
                        case '1':
                            resCitaMsg = 'New';
                            client.sendMessage(message.from, `Ingrese el nombre del paciente, hora de reserva y la hora\n\n❗Ejemplo: Juan Perez para el día 30 de agosto a las 9 AM \n❗Ejemplo: El 30/08/2023 a 14:30 para Juan Perez`);
                            conversation.state = States.WAITING_DATA_CLIENT;
                            break;
                        case '2':
                            try {
                                const res = await listMeetClient(chatId.split('@')[0], 'CASE_2');

                                if (!res) {
                                    client.sendMessage(message.from, '📵 No existen reservas con su número de celular');
                                    conversation.state = States.INITIAL;
                                    return mainMenu();
                                }

                                let listadoFinal = (res.msg.toString()).replace(/,/g, '');
                                client.sendMessage(message.from, `A continuacion se muestra el NOMBRE, FECHA Y HORARIO DE RESERVA.\n`);
                                client.sendMessage(message.from, listadoFinal);
                                conversation.state = States.INITIAL;
                                return mainMenu();

                            } catch (err) { console.error(err); } break;

                        case '3':
                            try {
                                const res = await listMeetClient(chatId.split('@')[0], 'CASE_3');

                                if (!res) {
                                    client.sendMessage(message.from, '📵 No existen reservas con su número de celular');
                                    conversation.state = States.INITIAL;
                                    return mainMenu();
                                }

                                lengthCancelMeet(res.msg.length, res.res); // pasar tamanio del array y el array entero
                                let listadoFinal = (res.msg.toString()).replace(/,/g, '');
                                client.sendMessage(message.from, `A continuacion se muestra el NOMBRE, FECHA Y HORARIO DE RESERVA.\n\nSeleccione un número del listado para cancelar su reserva:`);
                                client.sendMessage(message.from, listadoFinal);
                                conversation.state = States.WAITING_CANCEL_MEET;

                            } catch (err) { console.error(err); }

                            break;

                        case '4':
                            client.sendMessage(message.from, `Ingrese la fecha y hora que desea reservar.
                                    \n ❗Ejemplo: Para mañana a las 9 AM
                                    \n ❗Ejemplo: El 26/09/2023 a las 16:00`);
                            conversation.state = States.WAITING_DATE_AVAILABLE;
                            break;

                        default:
                            client.sendMessage(message.from, `Bienvenido/a \nGracias por contactarse con nuestro CHATBOT 🤖
                            \nIngrese el número correcto del menú para iniciar su operación:
                            \n 1⃣ Reservar\n 2⃣ Ver mis reservas\n 3⃣ Cancelar reserva\n 4⃣ Ver horarios disponibles`);
                    }
                    break;

                case States.WAITING_COMPLETE_DATA_CLIENT:

                    console.log("WAITING_COMPLETE_DATA_CLIENT??");
                    resCita[resCitaKey] = whatsappPrompt;
                    console.log("resCita despues  :( ==>", resCita);
                    const { hora, nombre, apellido, fecha_reserva } = resCita;

                    if (hora === null || nombre === null || apellido === null || fecha_reserva === null) {
                        completeData();

                    } else {
                        ifNotNull();

                    }


                    break;


                case States.WAITING_DATA_CLIENT:

                    console.log("WAITING_DATA_CLIENT  ??");

                    if (resCitaMsg === 'New') {
                        resCita = await resultadoCita(whatsappPrompt, resCitaMsg);
                        resCitaMsg = 'Repeating';
                    }

                    console.log('llenamos resCita primero +++ ', resCita);

                    if (resCita.hora === null || resCita.nombre === null || resCita.apellido === null || resCita.fecha_reserva === null) {

                        completeData();

                    } else {

                        ifNotNull();

                    }

                    break;

                case States.WAITING_SELECT_HOUR:
                    let num = (Number(whatsappPrompt) - 1);
                    // SI EL CLIENTE INGRESA UN # < 0, # FUERA DE RANGO DE LOS HORARIOS, Y LETRAS..
                    if (num < 0 || (Number(whatsappPrompt)) > (tempAvailableHours.length) || isNaN(num)) {
                        client.sendMessage(message.from, '❌No seleccionó la hora correctamente');
                        conversation.state = States.INITIAL;
                        return mainMenu();
                    }

                    // Mostrar la hora seleccionada por el usuario con la fecha y nombres.
                    client.sendMessage(message.from, `Verificar NOMBRE, FECHA Y HORA seleccionada:\n\nNombre: ${tempDataClient.nombre} ${tempDataClient.apellido}\nFecha: ${tempDataClient.fecha_reserva}\nHora: ${tempAvailableHours[num].horario}\n\n¿Confirmar cita?\n1⃣ Si\n2⃣ No`);
                    tempDataClient.id_horario = tempAvailableHours[num].id_horario; // agregar id_horario para almacenar en la BD
                    conversation.state = States.WAITING_CONFIRM_MEETING;

                    break;

                case States.WAITING_CONFIRM_MEETING:
                    switch (whatsappPrompt) {
                        case '1':
                            try {
                                client.sendMessage(message.from, '✅Se agendo su cita correctamente!');
                                await saveMeeting(tempDataClient);
                                resCita = null;
                                return mainMenu();

                            } catch (e) { console.error(e); }

                            break;

                        case '2':
                            client.sendMessage(message.from, '❌Reserva cancelada');
                            resCita = null;
                            mainMenu();
                            break;

                        default:
                            client.sendMessage(message.from, `‼Seleccione la opción correcta`);
                    }

                    break;

                case States.WAITING_DATE_AVAILABLE:
                    try {
                        const res = await validateRangeHour(whatsappPrompt);

                        if (typeof res === 'string') {
                            client.sendMessage(message.from, res);
                            conversation.state = States.INITIAL;
                            return mainMenu();
                        }

                        let listArray = [];

                        res.map((p, i) => listArray.push(`${i + 1}. ${p.horario} \n`));
                        let listadoFinal = `Horarios disponibles:\n\n${listArray.toString()}\n`
                        client.sendMessage(message.from, listadoFinal.replace(/,/g, ''));
                        conversation.state = States.INITIAL;
                        return mainMenu();

                    } catch (err) { console.error(err); }

                    break;

                case States.WAITING_CANCEL_MEET:
                    try {
                        const res = await listMeetClient2(whatsappPrompt, lengthCancel, arrayCancel);

                        if (res === 'menu') {
                            conversation.state = States.INITIAL;
                            return mainMenu();
                        }

                        if (typeof res === 'object') {
                            client.sendMessage(message.from, `Está seguro(a) que desea cancelar su reserva de fecha ${res.fecha_reserva} en el horario de ${res.horario} para ${res.nombre} ${res.apellido}❓\n\n1️⃣Si\n2️⃣No`);
                            idCancelMeet = res.id_reserva;
                            return conversation.state = States.WAITING_CANCEL_MEET2;
                        }

                    } catch (err) { console.error(err); }

                    break;

                case States.WAITING_CANCEL_MEET2:
                    switch (whatsappPrompt) {
                        case '1':
                            try {
                                await listMeetClient3(idCancelMeet);
                                client.sendMessage(message.from, 'Cita cancelada correctamente‼');
                                conversation.state = States.INITIAL;
                                return mainMenu();

                            } catch (e) { console.error(e); }

                            break;

                        case '2':
                            client.sendMessage(message.from, 'Solicitud cancelada❗');
                            conversation.state = States.INITIAL;
                            mainMenu();

                            break;
                        default:
                            client.sendMessage(message.from, `⚠ Digite una opción correcta`);
                    }

                    break;

                default:
                    // En caso de que se encuentre en un estado no reconocido
                    client.sendMessage(message.from, `Bienvenido/a \nGracias por contactarse con nuestro CHATBOT 🤖
                    \nIngrese el número correcto del menú para iniciar su operación:
                    \n 1⃣ Reservar\n 2⃣ Ver mis reservas\n 3⃣ Cancelar reserva\n 4⃣ Ver horarios disponibles`);
            }
        });

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    chatbotController
}


