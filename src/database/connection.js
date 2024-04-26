const { Pool } = require('pg');
require('dotenv').config();

const { PG_CONNECTION_STRING } = process.env;

// Configuración de la conexión a la base de datos PG
const Con = new Pool({
    connectionString: PG_CONNECTION_STRING
});

module.exports = { Con };