const { response, request } = require("express");
const { Types } = require('mongoose');
const { idProductosExiste } = require("../helpers/db-validator");

const { Producto, Categoria, Role, Usuario } = require('../models')

const coleccionesPermitidas = [
    'productos',
    'categorias',
    'usuarios',
    'roles'
]


const buscarUsuarios = async(termino = '', res = response)=> {

    const esMongoId =  Types.ObjectId.isValid(termino);

    if(esMongoId){

        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }

    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        $or: [{ name: regex }, {correo: regex}, {rol: regex}],
        $and: [{estado: true}]
    })

    res.json({
        results: usuarios
    })

}

const buscarProductos = async(termino = '', res = response)=> {

    const esMongoId =  Types.ObjectId.isValid(termino);

    if(esMongoId){
        
        const [...productosById] = await Promise.all([
                Producto.findById(termino)
                        .populate('categoria', 'nombre')
                        .populate('usuario', 'name'),
                Producto.find({ usuario: termino, estado: true})
                        .populate('categoria', 'nombre')
                        .populate('usuario', 'name'),
                Producto.find({categoria: termino, estado: true})
                        .populate('categoria', 'nombre')
                        .populate('usuario', 'name')
            ])

        return (!idProductosExiste(productosById)) 
                    ?   res.status(400).json({ message: 'El termino buscado no existe' })
                    :   productosById.forEach(value => {
                            if(value?.length > 0 || value !== null & Array.isArray(value) === false){
                                return res.json({
                                    results: Array.isArray(value) ? value : [value]
                                });
                            }
                        });

    }

    const regex = new RegExp(termino, 'i');

    const producto = await Producto.find({
        $or: [{ nombre: regex }],
        $and: [{estado: true}]
    })
    .populate('categoria', 'nombre')
    .populate('usuario', 'name');

    res.json({
        results: producto
    })

}

const buscarCategorias = async(termino = '', res = response)=> {

    const esMongoId =  Types.ObjectId.isValid(termino);

    if(esMongoId){

        const categoria = await Categoria.findById(termino).populate('usuario', 'name');
        const categoriasByUser = await Categoria.find({usuario: termino}).populate('usuario', 'name');
        
        return res.json({
            results: (categoria) ? [categoria] : [] ||
                     (categoriasByUser) ? categoriasByUser : []
        })
    }

    const regex = new RegExp(termino, 'i');

    const categoria = await Categoria.find({
        $or: [{ nombre: regex }],
        $and: [{estado: true}]
    })
    .populate('usuario', 'name')

    res.json({
        results: categoria
    })

}

const buscar = (req = request, res = response)=> {

    const {coleccion, termino} = req.params

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            message: `Las colecciones permitidas son ${coleccionesPermitidas}` 
        })
    }

    switch (coleccion) {
        case 'productos':
            return buscarProductos(termino, res)
        case 'categorias':
            return buscarCategorias(termino, res);
        case 'usuarios':
            return buscarUsuarios(termino, res);
    
        default:
            res.status(500).json({
                message: 'Se me olvido hacer la busqueda'
            });
    }

    res.json({
        coleccion,
        termino
    })
}

module.exports = {
    buscar,
}