const {response, request} = require('express');
const {cargarArchivos} = require('../helpers/subir-archivos');
const {Usuario, Producto} = require('../models');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2

cloudinary.config( process.env.CLOUDINARY_URL )


const subirArchivos = async(req, res = response) => {
    
    try {
        const nombreArchivo = await cargarArchivos(req.files, undefined, 'imgs')
        
        res.json({nombreArchivo});
    } catch (message) {
        res.status(400).json({
            message
        })
    }



}

const actualizarImagen = async(req = request, res = response)=> {

    const {coleccion, id} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if(!modelo){
                return res.status(400).json({
                    message: `No existe el usuario con el id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id)
            if(!modelo){
                return res.status(400).json({
                    message: `No existe el producto con el id ${id}`
                })
            }
            break;
    
        default:
            return res.status(500).json({message: 'Se me olvido añadir esta coleccion'});
    }

    //Limpiar imagenes previas
    if(modelo.img){
        //Hay que borrar la imagen anterior del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await cargarArchivos( req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();

    res.json(modelo);
}


const actualizarImagenCloudinary = async(req = request, res = response)=> {

    const {coleccion, id} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if(!modelo){
                return res.status(400).json({
                    message: `No existe el usuario con el id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id)
            if(!modelo){
                return res.status(400).json({
                    message: `No existe el producto con el id ${id}`
                })
            }
            break;
    
        default:
            return res.status(500).json({message: 'Se me olvido añadir esta coleccion'});
    }

    //Limpiar imagenes previas
    if(modelo.img){
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[ nombreArr.length - 1 ];
        const [ public_id ] = nombre.split('.')
        
        cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    modelo.img = secure_url;

    await modelo.save();

    res.json(modelo);
}

const mostrarImagen = async(req = request, res = response) => {

    const {coleccion, id} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if(!modelo){
                return res.status(400).json({
                    message: `No existe el usuario con el id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id)
            if(!modelo){
                return res.status(400).json({
                    message: `No existe el producto con el id ${id}`
                })
            }
            break;
    
        default:
            return res.status(500).json({message: 'Se me olvido añadir esta coleccion'});
    }

    //Limpiar imagenes previas
    if(modelo.img){
        //Hay que borrar la imagen anterior del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

        if(fs.existsSync(pathImagen)){
            return res.sendFile(pathImagen);
        }
    }

    const pathNoImage = path.join(__dirname, '../assets/no-image.jpg');

    res.sendFile(pathNoImage)


}


module.exports = {
    subirArchivos,
    actualizarImagenCloudinary,
    mostrarImagen
}