const {request ,response} = require('express');
const Usuario = require('../models/usuario')
const bcryptJs = require('bcryptjs');

const usuariosGet = (req = request, res = response)=> {
    const querys = req.query

    res.json({
        ok: true,
        message: 'Get API controller'
    })

}

const usuariosPost = async (req = request, res = response)=> {


    const {name, correo, password, rol} = req.body;
    const usuario = new Usuario({name, correo, password, rol});
    
    //verificar si el correo existe
    const existeEmail = await Usuario.findOne({correo});
    if(existeEmail){
        return res.status(400).json({
            msg: 'El correo ya esta registrado'
        })
    }

    //encryptar contraseña
    const salt = bcryptJs.genSaltSync();
    usuario.password = bcryptJs.hashSync(password, salt);

    //guardar en db
    await usuario.save();

    console.log('usuario creado')
    res.json({
        ok: true,
        message: 'Post API controller',
        usuario
    })

}

const usuariosDelete = (req = request, res = response)=> {

    res.json({
        ok: true,
        message: 'Delete API controller'
    })

}

const usuariosPut = (req = request, res = response)=> {

    const idUser = req.params.id;

    res.json({
        ok: true,
        message: 'Put API controller'
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