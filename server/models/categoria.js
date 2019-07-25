const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;


let categoriaSchema = new Schema({

    nombre: {

        type: String,
        unique: true,
        required: [true, 'El nombre es necesario']
    },
    descripcion: {
        type: String,
        required: [true, 'Toda categoría debe tener su descripción']

    }



});

module.exports = mongoose.model('Categoria', categoriaSchema);