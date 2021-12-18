const {Schema, model} = require('mongoose')


const CategoriaSchema = new Schema({

    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre de la categoria es obligatoria']
    },

    estado: {
        type: Boolean,
        default: true,
        required: true
    },

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },

})

CategoriaSchema.methods.toJSON = function () {
    const {__v, estado, ...data} = this.toObject();
    
    return data;
}

module.exports = model('Categoria', CategoriaSchema)