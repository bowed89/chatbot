const {
    getAllHours,
    saveHour,
    updateHour,
    deleteHour,
    getHourByValue
} = require('../database/database_hours');

const ListHoursController = async (req, res) => {
    try {
        const result = await getAllHours();
        res.send(result);

    } catch (error) {
        res.status(500).json({ message: 'Error al listar los horarios' });
    }
}

const ListHorarioController = async (req, res) => {
    if (!req.params.horario) return res.status(404).json({ message: 'Verifique el parametro horario' });

    try {
        const result = await getHourByValue(req.params.horario);
        res.send(result);

    } catch (error) {
        res.status(500).json({ message: 'Error al listar el horario' });
    }
}

const SaveHourController = async (req, res) => {

    if (!req.body.horario) return res.status(404).json({ message: 'Verifique los campos requeridos' });

    try {
        const result = await saveHour(req.body);
        res.status(200).json({ result });

    } catch (error) {
        res.status(500).json({ message: 'Error al insertar un nuevo horario' });
    }
}

const UpdateHourController = async (req, res) => {
    try {
        const result = await updateHour(req.body, req.params.id);
        res.status(200).json({ result });

    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar un horario' });
    }
}

const DeleteHourController = async (req, res) => {
    try {
        const result = await deleteHour(req.body, req.params.id);
        res.status(200).json({ result });

    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar un horario' });
    }
}

module.exports = {
    ListHoursController,
    SaveHourController,
    UpdateHourController,
    DeleteHourController,
    ListHorarioController
};
