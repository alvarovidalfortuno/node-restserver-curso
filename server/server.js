require('./config/config'); //Setea el Puerto para ambiente de prueba o Producción
const express = require('express'); //Librería para interactuar con servicios
const app = express(); //prepara un propiedad para usar el express
const bodyParser = require('body-parser'); //Librería usada para dar formato JSON
const mongoose = require('mongoose'); //Librería para interactuar con MongoDB
const path = require('path'); //Para usar ubicaciones locales y renderizar páginas


/**
 * Inicializando el parsing para JSON
 */

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/index'));

app.use(express.static(path.resolve(__dirname, '../public')));

/*

*/
//app.use(express.urlencoded({extended: false}))


//si la conexión está abierta, ésta recibe el JSON y lo envía a su dirección ?????
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true })
    .then(res => {
        console.log(`Conexión exitosa`);
    }).catch(err => {
        console.log(err);
    });


app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});