require('dotenv').config();
const cors = require('cors');
// console.log('Variable MONGODB_CNN:', process.env.DB_CNN);

const express = require('express');
const dbconnection = require('./database/config');

// console.log(process.env)

// crear servidor de express
const app = express();

// base de datos
dbconnection();

//CORS
app.use(cors());

// directorio publico
// use, middleware, func q se ejecuta en el momento q se hace una peticion
app.use(express.static('public'));

// lectura y parseo del body
app.use(express.json());

// rutas
// auth // crear, login, renew
app.use('/api/auth', require('./routes/auth'));

// TODO: crud: eventos
app.use('/api/events', require('./routes/events'));

// escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`servidor corriendo en puerto ${process.env.PORT}`);
});