const mongoose = require('mongoose');
let Schema = mongoose.Schema;


let categoriaSchema = new Schema({
    nombre: { type: String, unique: true, required: [true, 'El nombre es necesario'] },
    descripcion: { type: String, required: [true, 'Toda categoría debe tener su descripción'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});


module.exports = mongoose.model('Categoria', categoriaSchema);