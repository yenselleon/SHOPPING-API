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
        default: 'USER_ROLE',
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


//Modificacion del metodo json que se encuentra en el esquema 
//para quitar el password y version
//Solo lo elimina al intentar hacer la peticion a la ruta, en nuestro db se mantiene
UsuarioSchema.methods.toJSON = function () {
    const {__v, password, _id, ...usuario} = this.toObject();
    usuario.uid = _id;
    
    return usuario
}

module.exports = model('Usuario', UsuarioSchema);