const { getAllMeeting, getMeetingByStatus, getMeetingByDate } = require('../database/database_meeting');

const patientController = async (req, res) => {
    try {
        const result = await getAllMeeting();
        res.send(result);

    } catch (error) {
        res.status(500).json({ message: 'Error to get all patient list' });
    }
}

const patientGetStatusController = async (req, res) => {
    try {
        const status = req.params.status;
        const result = await getMeetingByStatus(status);
        res.send(result);

    } catch (error) {
        res.status(500).json({ message: 'Error to get all patient list' });
    }
}

const patientGetDateController = async (req, res) => {
    try {
        const date = req.body.date;
        const result = await getMeetingByDate(date);
        res.send(result);

    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = {
    patientController,
    patientGetStatusController,
    patientGetDateController
};
