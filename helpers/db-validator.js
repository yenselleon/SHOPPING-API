const Role = require('../models/role');
const Usuario = require('../models/usuario')



const validarRol = async(rol = '') => {
    const existeRol = await Role.findOne({rol});

    if(!existeRol){
        throw new Error(`El rol ${rol} no esta ingresado en la BD`)
    }
}

const emailExiste = async(correo = '')=>{

    //verificar si el correo existe
    const existeEmail = await Usuario.findOne({correo});
    if(existeEmail){
        throw new Error(`El correo ${correo} ya se encuentra registrado`)
    }
}

const idExiste = async(id)=>{

    //verificar si el correo existe
    const existeId = await Usuario.findById(id);
    if(!existeId){
        throw new Error(`El id ${id} no se encuentra registrado en la BD`)
    }
}


module.exports = {
    validarRol,
    emailExiste,
    idExiste
}