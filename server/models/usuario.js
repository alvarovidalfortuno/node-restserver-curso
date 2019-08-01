const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un role válido'

};
let Schema = mongoose.Schema; //Schema podría ir con minúscula, pero como se declarará con NEW es un standard que vaya con mayúscula (let Schema)
//Mongoose Schema crea el registro de base de datos en MongoDB


//Se crea el esquema, se establecen datos, tipos de datos y valores por defecto
let usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: 'String', unique: true, required: [true, 'El email es necesario'] },
    password: { type: String, required: [true, 'La constraseña es obligatoria'] },
    img: { type: String, require: false },
    role: { type: String, default: 'USER_ROLE', enum: rolesValidos },
    estado: { type: Boolean, default: true },
    google: { type: Boolean, default: false }
});
//Método para no enviar el Password en el response
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' })
module.exports = mongoose.model('Usuario', usuarioSchema); //Se exporta dándole un alias