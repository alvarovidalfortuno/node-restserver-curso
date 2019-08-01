const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const Categoria = require('../models/categoria');

const app = express();






/**Mostrar todas las categorias */
app.get('/categoria', (req, res) => {


    Categoria.find({})
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, Categorias) => {

            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                })
            } else {
                res.json({
                    ok: true,
                    Categorias: Categorias
                });
            }

        })
});


/**Mostrar tcategoria por id */
app.get('/categoria/:id', (req, res) => {

    let id = req.params.id
    Categoria.findById({ id })
        .exec((err, Categoria) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                });

            } else {
                res.json({
                    ok: true,
                    categoria: Categoria
                });
            }

        });
});

/**Crear nueva categoría */
app.post('/categoria', verificaToken, (req, res) => {
    //regresa la nueva categoria

    let categoria = new Categoria({
        id: req.body.id,
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {

            res.status(400).json({
                ok: false,
                err

            });
        } else {
            res.json({
                ok: true,
                categoriaDB
            });
        }
    });
});

/**Actualiza categoria */
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let categoria = new Categoria({
        nombre: req.body.nombre,
        descripcion: req.body.descripcion
    });

    Categoria.findByIdAndUpdate(id, { nombre: categoria.nombre, descripcion: categoria.descripcion })
        .exec((err, categoriaDB) => {
            if (err) {
                res.status(400).json({

                    ok: false,
                    err
                });
            } else {
                res.json({
                    ok: true


                });


            }



        })

});

/**Borrar Categoria(Solo debe poder hacerlo un administrador) */
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {


    let id = req.params.id;

    Categoria.findByIdAndDelete(id).exec((err, categoriaDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        } else {
            if (categoriaDB === null) {
                res.json({
                    mensaje: 'No se encuentra la categoría'

                })
            } else {
                res.json({
                    ok: true,
                    mensaje: 'Categoría Eliminada',
                    categoriaDB


                })
            }


        }
    });
});

module.exports = app;