const {response, request} = require('express')


const validarArchivosSubidos = (req = request, res = response, next)=> {


    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({message: 'Ningun archivo fue enviado.'});
    }

    next();

}


module.exports = {
    validarArchivosSubidos
}