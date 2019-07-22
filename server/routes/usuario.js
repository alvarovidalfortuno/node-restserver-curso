//Cargar express
const express = require('express');
//Cargar encriptador
const bcrypt = require('bcrypt');
//Cargar Validador??
const _ = require('underscore'); // para escoger que campos quiero actualizar
//Inicializar express
const app = express();
//Instanciando el esquema del usuario
const Usuario = require('../models/usuario');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion')



app.get('/usuario', verificaToken, (req, res) => {

        let desde = req.query.desde || 5;
        let limite = req.query.limite;
        desde = Number(desde);
        limite = Number(limite);

        Usuario.find({ "estado": true })
            .skip(desde)
            .limit(limite)
            .exec((err, Usuarios) => {

                if (err) {
                    res.status(400).json({
                        ok: false,
                        err
                    })
                }
                Usuario.find({ "estado": true }).count()
                    .exec((err, nRegistros) => {
                        if (err) {
                            res.status(400).json({
                                ok: false,
                                err
                            })
                        }
                        res.json({
                            ok: true,
                            Usuarios: Usuarios,
                            n_usuarios: nRegistros
                        })
                    })
            })



    })
    //CREAR USUARIO
app.post('/usuario', [verificaToken, verificaAdmin_Role], function(req, res) {

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
                return res.status(400).json({ //Al imprimir conserva las modificaciones al toJSON del SCHEMA
                    ok: false,
                    err
                });

            }
            //usuarioDB.password = null;
            res.json({ //Al imprimir conserva las modificaciones al toJSON del SCHEMA
                ok: true,
                usuario: usuarioDB
            });
        });



    })
    //ACTUALIZAR
app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {
        let id = req.params.id;
        let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);


        Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuarioDB
            });

        })
    })
    //ELIMINAR USUARIO
app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;
    let estado = false;
    Usuario.findByIdAndUpdate(id, { estado }, { new: true }, (err, UsuarioEliminado) => {

        if (err) {
            res.status(400).json({
                ok: false,
                err
            })

        }
        if (!UsuarioEliminado) {
            res.status(400).json({
                ok: false,
                error: {
                    mensaje: "Usuario no encontrado"
                }
            })
        }
        res.json({
            ok: true,
            usuario_eliminado: UsuarioEliminado
        })

    })



})

module.exports = app;