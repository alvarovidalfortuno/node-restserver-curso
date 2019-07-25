const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

const Categoria = require('../models/categoria');

const app = express();






/**Mostrar todas las categorias */
app.get('/categoria', (req, res) => {


    Categoria.find()
        .exec((err, Categorias) => {

            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                Categorias: Categorias
            })
        })
});


/**Mostrar tcategoria por id */
app.get('/categoria/:id', (req, res) => {



});

/**Crear nueva categoría */
app.post('/categoria', (req, res) => {
    //regresa la nueva categoria


});

/**Actualiza categoria */
app.put('/categoria/:id', (req, res) => {



});

/**Borrar Categoria(Solo debe poder hacerlo un administrador) */
app.delete('/categoria/:id', (req, res) => {
    //




});

module.exports = app;