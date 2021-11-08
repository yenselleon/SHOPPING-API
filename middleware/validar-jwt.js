const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');



const validarJWT = async(req = request, res = response, next)=> {

    const token = req.header('x-token');

    if(!token){
        res.status(401).json({
            message: 'No hay token en la peticion'
        })
    }

    try {
        
        const {uid} = jwt.verify(token, process.env.SECRETPRIVATEKEYJWT)
        const usuario = await Usuario.findById(uid);

        if(!usuario){
            return res.status(400).json({
                message: 'token no valido'
            })
        }

        if(!usuario.estado){
            return res.status(401).json({
                message: 'token no valido'
            })
        }

        req.usuario = usuario;
        
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            message: 'Token no valido'
        })
    }

}


module.exports = {
    validarJWT,
}