const express = require('express');
const api = express.Router();

const { bulkMsgController } = require('../controller/bulkMsgController');

// Middleware para parsear el cuerpo de las solicitudes a JSON
api.use(express.json());
api.post('/bulkMsg', bulkMsgController);

module.exports = api 