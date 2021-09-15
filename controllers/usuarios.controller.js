const {request ,response} = require('express');
const Usuario = require('../models/usuario')
const bcryptJs = require('bcryptjs');

const usuariosGet = async(req = request, res = response)=> {
    const querys = req.query
    const {limit = 5, desde = 0, estado = true } = querys


    const [usuarios, total] = await Promise.all([
        Usuario.find({estado})
            .skip(Number(desde))
            .limit(Number(limit)),
        Usuario.countDocuments({estado}),
    ]) 

    res.json({
        total,
        usuarios
    })

}

const usuariosPost = async (req = request, res = response)=> {


    const {name, correo, password, rol, google} = req.body;
    const usuario = new Usuario({name, correo, password, rol, google});
    
    

    //encryptar contraseña
    const salt = bcryptJs.genSaltSync();
    usuario.password = bcryptJs.hashSync(password, salt);

    //guardar en db
    await usuario.save();

    console.log('usuario creado')
    res.json({
        ok: true,
        message: 'Usuario registrado exitosamente',
        usuario
    })

}

const usuariosDelete = async(req = request, res = response)=> {

    const {id} = req.params;

    //No se deben eliminar documentos de nuestra db
    //Es mejor crear un estado y cambiarlo de activo a inactivo


    const usuario = await Usuario.findByIdAndUpdate(id, {estado : false});

    res.json({
        ok: true,
        message: 'user deleted',
        usuario
    })

}

const usuariosPut = async(req = request, res = response)=> {

    const {id} = req.params;
    const {correo, password, google, ...rest} = req.body;

    if(password){
        //encryptar contraseña
        const salt = bcryptJs.genSaltSync();
        rest.password = bcryptJs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, rest)

    res.json({
        ok: true,
        message: 'Datos del usuario actualizado',
        usuario
    })

}

const usuariosPatch = (req = request, res = response)=> {

    res.json({
        ok: true,
        message: 'Patch API controller'
    })

}

module.exports = {
    usuariosGet,
    usuariosDelete,
    usuariosPut,
    usuariosPatch,
    usuariosPost
}