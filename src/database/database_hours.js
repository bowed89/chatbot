const { Con } = require('./connection');


const getAllHours = async () => {
    const query = `SELECT * FROM horario_reserva WHERE activo = '1' ORDER BY id_horario ASC`;
    try {
        const res = await Con.query(query);
        return res.rows;

    } catch (err) {
        console.error(err);
    }

};

const getHourByValue = async (horario) => {
    const query = `SELECT * FROM horario_reserva WHERE horario = ${horario}`;
    try {
        const res = await Con.query(query);
        return res.rows;

    } catch (err) {
        console.error(err);
    }

};


// FUNCIONES PARA REVISAR LOS HORARIOS DISPONIBLES
// PREGUNTAR SI EXISTE LA HORA QUE EL USUARIO PREGUNTA
const checkIfExistsHour = async () => {
    try {
        const query = `SELECT * FROM horario_reserva`;
        const { rows } = await Con.query(query);

        return rows;

    } catch (e) {
        console.error(e);
    }

};

// REVISAR LOS RANGOS DE HORA  DISPONIBLES RESPECTO A FECHAS
const checkRangeHour = async (fecha, hora1, hora2) => {
    const query = `SELECT hr.horario FROM horario_reserva AS hr
                    WHERE NOT EXISTS(
                                    SELECT *
                                    FROM reserva_medica AS rm
                                    WHERE rm.id_horario = hr.id_horario
                                    AND rm.fecha_reserva=$1
                                    )
                    AND hr.horario BETWEEN $2 AND $3`;

    const values = [fecha, hora1, hora2];

    try {
        const res = await Con.query(query, values);
        return res.rows;

    } catch (err) {
        console.error(err);
    }

};

const saveHour = async (body) => {
    const { horario } = body;
    const query = `INSERT INTO horario_reserva
                    (horario, tipo, activo, created_at)
                    VALUES ($1, 'all', 1, CURRENT_TIMESTAMP)`;

    const values = [horario];

    try {
        const queryResult = await Con.query(query, values);
        return queryResult.rows[0];

    } catch (err) {
        console.error(err);
    }
};

const updateHour = async (body, id) => {
    const { horario } = body;
    const updateQuery = `UPDATE horario_reserva 
                            SET horario = $1, updated_at = CURRENT_TIMESTAMP, tipo = 'all', activo = 1 
                            WHERE id_horario = ${id} 
                            RETURNING *`;
    const updateValues = [horario];

    try {
        // Realizar la actualización
        const updateResult = await Con.query(updateQuery, updateValues);
        //  const updatedData = updateResult.rows[0]; // Los nuevos datos actualizados
        return updateResult.rows[0];

    } catch (err) {
        console.error(err);
    }
};

const deleteHour = async (body, id) => {
    const { activo } = body;
    const deleteQuery = `UPDATE horario_reserva 
                            SET activo = $1, deleted_at = CURRENT_TIMESTAMP
                            WHERE id_horario = ${id}  
                            RETURNING *`;
    const deleteValues = [activo];

    try {
        // Realizar la actualización
        const updateResult = await Con.query(deleteQuery, deleteValues);
        return updateResult.rows[0];

    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    checkIfExistsHour,
    checkRangeHour,
    getAllHours,
    saveHour,
    updateHour,
    deleteHour,
    getHourByValue
};