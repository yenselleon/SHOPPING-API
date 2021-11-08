const { response, request } = require("express");




const esAdminRole = (req = request, res = response, next)=> {

    if(!req.usuario){
        return res.status(500).json({
            message: 'La informacion del usuario debe de ser retornada antes de ejecutar la validacion'
        })
    }

    const {rol, name} = req.usuario;

    if(rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            message: `${name} no es un usuario administrador`
        })
    }

    next()

}

const tieneRole = (...roles)=> {
    return (req = request, res = response, next)=> {

        if(!req.usuario){
            return res.status(500).json({
                message: 'La informacion del usuario debe de ser retornada antes de ejecutar la validacion'
            })
        }

        if(!roles.includes(req.usuario.rol)){
            return res.status(401).json({
                message: `${usuario.name} no es un usuario valido para realizar esta operacion`
            })
        }
    
        next()

    }
}

module.exports = {
    esAdminRole,
    tieneRole,
}