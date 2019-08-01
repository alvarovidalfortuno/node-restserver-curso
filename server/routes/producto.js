const express = require('express');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');


/**
 * ==============================
 * Obtener productos
 * ==============================
 */

app.get('/productos', verificaToken, (req, res) => {
    //trae todos los productos
    //populate: usuario y categoria
    //paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario')
        .populate('categoria')
        .exec((err, usuarioDB) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            } else {
                if (!usuarioDB) {
                    res.status(400).json({
                        ok: false,
                        message: 'No se encontraron registros'
                    });
                } else {
                    res.json({
                        ok: true,
                        usuarioDB
                    });
                }
            }
        });
});

/**
 * ==============================
 * Obtener 1 producto por ID
 * ==============================
 */
app.get('/productos/:id', verificaToken, (req, res) => {
    //populate: usuario y categoria
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario')
        .populate('categoria')
        .exec((err, productoDB) => {

            if (err) {
                res.status(500).json({

                    ok: false,
                    productoDB
                });


            } else {
                if (!productoDB) {
                    res.status(400).json({
                        ok: false,
                        message: 'No se encuentra registro'
                    });

                } else {
                    res.json({
                        ok: true,
                        productoDB
                    });
                }

            }
        });
});
/**
 * ==============================
 * Obtener 1 producto por ID
 * ==============================
 */

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex }).exec((err, listaProductos) => {

        if (err) {
            res.status(500).json({
                ok: false,
                err
            });


        } else {

            if (!listaProductos) {
                res.status(400).json({
                    ok: false,
                    message: 'No se encontró registro'
                });


            } else {

                res.json({
                    ok: true,
                    listaProductos

                });



            }
        }
    });
});
/**
 * ==============================
 * Crear un nuevo producto
 * ==============================
 */

app.post('/productos', verificaToken, (req, res) => {
    //grabar un usuario
    //grabar una categoria del listado

    let producto = new Producto({

        nombre: req.body.nombre,
        precioUni: req.body.precioUni,
        descripcion: req.body.descripcion,
        disponible: req.body.disponible,
        categoria: req.body.categoria, //de donde tomo la id de la categoria
        usuario: req.usuario._id //de donde sale éste usuario? R: Viene del MiddleWare "verificaToken"
    });

    producto.save((err, productoDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err


            });
        } else {
            if (!productoDB) {
                res.status(400).json({

                    ok: false,
                    message: 'Error al intentar crear el producto'
                });
            } else {
                res.status(201).json({
                    ok: true,
                    message: 'Producto creado con éxito'
                });
            }
        }
    });




});


/**
 * ==============================
 * Actualizar un producto
 * ==============================
 */

app.put('/productos/:id', verificaToken, (req, res) => {
    //grabar un usuario
    //grabar una categoria del listado
    let id = req.params.id;
    let body = req.body;
    let update = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id


    }

    Producto.findByIdAndUpdate(id, update).exec((err, productoDB) => {

        if (err) {
            res.status(500).json({
                ok: false,
                err
            });


        } else {

            if (!productoDB) {
                res.status(400).json({
                    ok: false,
                    message: 'No se encontró registro'
                });


            } else {

                res.json({
                    ok: true,
                    message: 'Producto actualizado con éxito',
                    productoDB

                });


            }

        }
    });



});

/**
 * ==============================
 * Borrar un producto
 * ==============================
 */
app.delete('/productos/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //Actualizar estado 'disponible' a false
    let id = req.params.id;


    Producto.findByIdAndRemove(id).exec((err, productoDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        } else {
            if (!productoDB) {
                res.status(400).json({

                    ok: false,
                    message: 'No se encontró Producto'

                });
            } else {
                res.json({
                    ok: true,
                    message: 'Producto borrado con éxito'

                });

            }


        }




    });



});


module.exports = app