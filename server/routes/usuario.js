//Cargar express
const express = require('express');
const bcrypt = require('bcrypt');
//Inicializar express
const app = express();
const Usuario = require('../models/usuario');

app.get('/usuario', function(req, res) {
    res.json('get usuario LOCAL');
})

app.post('/usuario', function(req, res) {

    let body = req.body; //"req.body" son los valores para las propiedades seteadas en POSTMAN

    //Setea los valores obtenidos en un nuevo objeto usuario
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });


    //Schema posee un método para grabar los datos en el.
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });

        }
        //usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });



})

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    res.json({
        id
    });
})

app.delete('/usuario', function(req, res) {
    res.json('delete usuario');
})


module.exports = app;