const { Con } = require('./connection');

// Función para obtener todas las citas de la base de datos
const getAllMeeting = async () => {
    try {
        const query = `SELECT rm.nombre, rm.apellido, hr.horario, 
                        rm.numero_cel, rm.estado, rm.fecha_reserva
                        FROM reserva_medica AS rm, horario_reserva AS hr
                        WHERE rm.id_horario = hr.id_horario
                        ORDER BY rm.fecha_reserva DESC`;

        const { rows } = await Con.query(query);
        return rows;

    } catch (e) {
        console.error(e);
    }
};

const getMeetByConfirmDate = async (date) => {
    const query = `SELECT rm.nombre, rm.apellido, hr.horario, 
                        rm.numero_cel, rm.estado, rm.fecha_reserva
                        FROM reserva_medica AS rm, horario_reserva AS hr
                        WHERE rm.id_horario = hr.id_horario
                        AND rm.fecha_reserva=$1
                        AND rm.estado='CONFIRMADO'`;

    const values = [date];
    try {
        const res = await Con.query(query, values);
        return res.rows;

    } catch (err) {
        console.error(err);
    }
};

// Función para obtener citas por estado
const getMeetingByStatus = async (status) => {

    const query = `SELECT rm.nombre, rm.apellido, hr.horario, 
                        rm.numero_cel, rm.estado, rm.fecha_reserva
                        FROM reserva_medica AS rm, horario_reserva AS hr
                        WHERE rm.id_horario = hr.id_horario
                        AND rm.estado=$1
                        ORDER BY rm.fecha_reserva DESC`;
    const values = [status];
    try {
        const res = await Con.query(query, values);
        return res.rows;

    } catch (err) {
        console.error(err);
    }
};

// Función para obtener citas por fecha
const getMeetingByDate = async (date) => {
    const query = `SELECT rm.nombre, rm.apellido, hr.horario, 
                        rm.numero_cel, rm.estado, rm.fecha_reserva
                        FROM reserva_medica AS rm, horario_reserva AS hr
                        WHERE rm.id_horario = hr.id_horario
                        AND rm.fecha_reserva=$1`;
    const values = [date];
    try {
        const res = await Con.query(query, values);
        return res.rows;

    } catch (err) {
        console.error(err);
    }
};

// Función para obtener citas por fecha
const getMeetingByDateConfirm = async (date) => {
    const query = `SELECT rm.nombre, rm.apellido, hr.horario, 
                        rm.numero_cel, rm.estado, rm.fecha_reserva
                        FROM reserva_medica AS rm, horario_reserva AS hr
                        WHERE rm.id_horario = hr.id_horario
                        AND rm.fecha_reserva=$1
                        AND rm.estado='CONFIRMADO'`;
    const values = [date];
    try {
        const res = await Con.query(query, values);
        return res.rows;

    } catch (err) {
        console.error(err);
    }
};

// Revisa si existe disponibilidad en la hora y fecha solicitada por el usuario
const checkMeeting = async (fecha, hora) => {
    const query = `SELECT * FROM horario_reserva AS hr
                    WHERE NOT EXISTS(
                        SELECT hr.horario, rm.fecha_reserva, rm.nombre, rm.apellido
                        FROM reserva_medica AS rm
                        WHERE rm.id_horario = hr.id_horario
                        AND rm.estado = 'CONFIRMADO'
                        AND rm.fecha_reserva=$1
                        AND hr.horario LIKE $2 || '%'
                    )
                    AND hr.horario LIKE $2 || '%'
                    AND hr.activo = '1'`;

    const values = [fecha, hora];

    try {
        const res = await Con.query(query, values);
        return res.rows;

    } catch (err) {
        console.error(err);
    }

};

const saveMeeting = async (body) => {
    const { nombre, apellido, fecha_reserva, numero_cel, id_horario } = body;
    const query = `INSERT INTO reserva_medica
                    (nombre, apellido, fecha_reserva, numero_cel, estado, id_horario, created_at) 
                    VALUES($1, $2, $3, $4, 'CONFIRMADO', $5, CURRENT_TIMESTAMP) `;
    const values = [nombre, apellido, fecha_reserva, numero_cel, id_horario];

    try {
        const res = await Con.query(query, values);
        console.log(`Se agrego ${res.rowCount} fila`);

    } catch (err) {
        console.error(err);
    }

}

// Función para guardar una cita en la base de datos 
const updateMeeting = async (embeddedField, id) => {
    const query = 'UPDATE restaurante_embedding SET embedding = $1 WHERE id = $2';
    const values = [embeddedField, id];

    try {
        const res = await Con.query(query, values);
        console.log(`Se actualizó ${res.rowCount} fila`);
    } catch (err) {
        console.error(err);
    }
};

// LISTADO DE RESERVA DE CLIENTE POR # DE CEL
const listMeetingClient = async (num) => {
    const query = `SELECT rm.id_reserva, rm.nombre, 
                    rm.apellido, rm.fecha_reserva, hr.horario  
                    FROM reserva_medica rm, horario_reserva hr
                    WHERE rm.id_horario=hr.id_horario
                    AND rm.numero_cel=$1
                    AND rm.estado='CONFIRMADO'`;

    const values = [num];

    try {
        const res = await Con.query(query, values);
        return res.rows;

    } catch (err) {
        console.error(err);
    }

};
// LISTADO DE RESERVA DE CLIENTE POR # DE CEL
const updateMeetingClient = async (id) => {
    const query = `UPDATE reserva_medica
                   SET estado='CANCELADO', updated_at=CURRENT_TIMESTAMP
                   WHERE id_reserva = $1;`;

    const values = [id];

    try {
        const res = await Con.query(query, values);
        return res.rows;

    } catch (err) {
        console.error(err);
    }

};

module.exports = {
    getAllMeeting,
    getMeetingByStatus,
    getMeetByConfirmDate,
    getMeetingByDate,
    updateMeeting,
    checkMeeting,
    saveMeeting,
    listMeetingClient,
    updateMeetingClient,
    getMeetingByDateConfirm
};