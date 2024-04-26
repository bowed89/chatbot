const express = require('express');
const api = express.Router();

const {
    ListHoursController,
    SaveHourController,
    UpdateHourController,
    DeleteHourController,
    ListHorarioController
} = require('../controller/hoursController');

// Middleware para parsear el cuerpo de las solicitudes a JSON
api.use(express.json());

api.get('/hours', ListHoursController);
api.get('/hours/:horario', ListHorarioController);
api.post('/hours', SaveHourController);
api.put('/hours/:id', UpdateHourController);
api.put('/hours-del/:id', DeleteHourController);


module.exports = api 