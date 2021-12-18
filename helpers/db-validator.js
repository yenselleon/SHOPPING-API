const { Categoria, Producto } = require('../models');
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

const idCategoriaExiste = async(id)=>{

    //verificar si el correo existe
    const existeId = await Categoria.findById(id);
    if(!existeId){
        throw new Error(`El id ${id} no se encuentra registrado en la BD`)
    }
}

const idProductoExiste = async(id)=>{

    //verificar si el correo existe
    const existeId = await Producto.findById(id);
    if(!existeId){
        throw new Error(`El id ${id} no se encuentra registrado en la BD`)
    }
}

const idProductosExiste = (promises) => {
    //verificar si es un array vacio o null
    return promises
                .some(value => {
                    if(value?.length > 0 || value !== null & Array.isArray(value) === false){
                        return true;
                    }
                });

}

/*------------------------------------------*/
/*--Validar Colecciones--*/
/*------------------------------------------*/

const coleccionesPermitidas = (coleccion, coleccionesPermitidas = [] ) => {

    if(!coleccionesPermitidas.includes(coleccion)){
        throw new Error(`la colecciones ${coleccion} no es una coleccion valida - ${coleccionesPermitidas}`)
    }

    return true

}


module.exports = {
    validarRol,
    emailExiste,
    idExiste,
    idCategoriaExiste,
    idProductoExiste,
    idProductosExiste,
    coleccionesPermitidas
}