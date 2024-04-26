const { messageEmitter, sendMessage } = require('../whatsapp/whatsapp-web');
const { getMeetingByDateConfirm } = require('../database/database_meeting');

const bulkMsgController = async (req, res) => {
    const date = req.body.date;
    console.log("date ==>" + date);
    
    try {
        const resMeeting = await getMeetingByDateConfirm(date);

        console.log("resMeeting ==>" + resMeeting);

        if (resMeeting.length === 0) return res.status(200).json({ message: 'No existe citas para la fecha seleccionada' });

        let index = 0;
        const intervalId = setInterval(() => {
            let number, datosPaciente;

            if (index < resMeeting.length) {
                number = `${resMeeting[index].numero_cel}@c.us`;
                datosPaciente = `Nombre: ${resMeeting[index].nombre} ${resMeeting[index].apellido}
                                 Fecha: ${resMeeting[index].fecha_reserva}
                                 Horario: ${resMeeting[index].horario}`;

                //Escuchar eventos de messageEmitter
                messageEmitter.on('messageSent', ({ chatId, message }) => {
                    console.log(`Mensaje enviado a ${chatId}: ${message}`);
                });

                // Llamar a la función sendMessage con el cliente obtenido
                sendMessage(number, `Saludos, le enviamos un recordatorio para su reserva:\n\n${datosPaciente}`);
                index++;

            } else {
                clearInterval(intervalId); // Detener el intervalo después de imprimir todos los elementos
                return res.status(200).json({ message: 'Envio de SMS correctamente' });
            }
        }, 7000);

    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
    bulkMsgController
};

