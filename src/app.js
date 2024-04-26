const express = require('express');
const app = express();

// cargar rutas
const chatbotRoute = require('./routes/botRoute');
const patientRoute = require('./routes/patientRoute');
const hoursRoute = require('./routes/hoursRoute');
const bulkMsgRoute = require('./routes/bulkMsgRoute');

// cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// rutas
app.use('/api', chatbotRoute);
app.use('/api', patientRoute);
app.use('/api', hoursRoute);
app.use('/api', bulkMsgRoute);

module.exports = app 