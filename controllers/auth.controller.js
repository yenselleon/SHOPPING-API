const { response, request } = require("express");
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const generarJWT = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");


const login = async(req = request, res = response)=> {

    const {correo, password} = req.body;

    try {
        
        //verificar si el usuario existe
        const usuario = await Usuario.findOne({correo});

        if(!usuario){
            return res.status(400).json({
                message: "El usuario no existe en nuestra base de datos",
            })
            
        }
        //Si el usuario esta activo
        if(!usuario.estado){
            return res.status(400).json({
                message: "El usuario o contraseña no son validos",
            })
        }
        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password)
        if(!validPassword){
            return res.status(400).json({
                message: 'El usuario o contraseña no son validos',
            })
        }
        //Generar el JWT
        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token
        })
    } catch (error) {
        consol.log(error)
        res.status(500).json({
            message: "Problemas de conexion con el servidor"
        })
    }


}


const googleLogin = async (req = request, res = response)=> {

    const {id_token} = req.body

    try {
        
        const {correo, name, img} = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});

        if(!usuario){
            const data = {
                name,
                correo,
                password: ':P',
                img,
                google: true,
            }

            usuario = new Usuario(data);
            await usuario.save();
        }

        if(!usuario.estado){

            res.status(401).json({
                message: 'El usuario esta bloqueado y no puede realizar esta accion'
            })

        }

        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            menssage: 'token de google no reconocido'
        })
    }


}


module.exports = {
    login,
    googleLogin
}