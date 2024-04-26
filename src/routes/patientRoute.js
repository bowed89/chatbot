const express = require('express');
const api = express.Router();

const { patientController, patientGetStatusController, patientGetDateController } = require('../controller/patientController');

// Middleware para parsear el cuerpo de las solicitudes a JSON
api.use(express.json());

api.get('/patients', patientController);
api.get('/patients/:status', patientGetStatusController);
api.post('/patients/date', patientGetDateController);

module.exports = api 