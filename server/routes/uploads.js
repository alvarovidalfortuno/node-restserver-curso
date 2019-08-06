const express = require('express');
const fileupload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

//incluyo fileupload en express
app.use(fileupload());
//----------------------------

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;
    id = id.trim();



    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'No se ha seleccionado ningún archivo'
        });
    }

    //valida tipo

    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: `Las extensiones válidas son:${tiposValidos.join(',')}`
            }
        });

    } else {
        let archivo = req.files.archivo;

        let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

        let nombreCortado = archivo.name.split('.');

        let extension = nombreCortado[nombreCortado.length - 1];

        if (extensionesValidas.indexOf(extension) < 0) {
            return res.status(400).json({
                ok: false,
                err: {

                    message: 'Las extensiones válidas son:\'png\', \'jpg\', \'gif\', \'jpeg\'',
                    extension: extension

                }
            });
        } else {

            //Cambiar nombre del archivo

            let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`


            archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                } else {

                    if (tipo === 'usuarios') {

                        imagenUsuario(id, res, nombreArchivo);

                    } else {

                        imagenProducto(id, res, nombreArchivo);

                    }


                }

            });
        }
    }


});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {

            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                err

            });
        } else {

            if (!usuarioDB) {

                borraArchivo(nombreArchivo, 'usuarios');

                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario no encontrado'

                    }
                });


            } else {


                borraArchivo(usuarioDB.img, 'usuarios');

                usuarioDB.img = nombreArchivo;
                usuarioDB.save((err, usuarioGuardado) => {
                    if (err) {
                        res.status(500).json({
                            ok: false,
                            err
                        });
                    } else {
                        res.json({
                            ok: true,
                            usuario: usuarioGuardado.email,
                            img: nombreArchivo
                        });
                    }
                });
            }

        }


    });
}

function borraArchivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);

    }

}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id).exec((err, productoDB) => {
        if (err) {

            borraArchivo(nombreArchivo, 'productos');

            res.status(500).json({
                ok: false,
                err

            });

        } else {
            if (!productoDB) {

                borraArchivo(nombreArchivo, 'productos');
                res.status(400).json({
                    ok: false,
                    message: `No se encontró "producto" con ID: ${id}`
                });
            } else {

                borraArchivo(productoDB.img, 'productos');

                productoDB.img = nombreArchivo;

                productoDB.save((err, productoGuardado) => {
                    if (err) {

                        res.status(500).json({
                            ok: false,
                            err
                        });

                    } else {

                        res.json({
                            ok: true,
                            producto: productoGuardado,
                            img: productoDB.img
                        });


                    }



                });
            }
        }
    });

}

module.exports = app;