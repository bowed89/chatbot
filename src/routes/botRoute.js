const express = require('express');
const api = express.Router();

const { generateQRController } = require('../controller/generateQRController');

api.get('/generateQR', generateQRController);

module.exports = api 