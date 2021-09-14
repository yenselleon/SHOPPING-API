const {Schema, model} = require('mongoose')


const UsuarioSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido'],
    },
    correo: {
        type: String,
        unique: true,
        required: [true, 'El correo es requerido'],
    },
    password: {
        type: String,
        required: [true, 'El password es obligatoria']
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado:{
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false
    }

})

module.exports = model('Usuario', UsuarioSchema);