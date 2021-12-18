const { request, response } = require("express")
const {Categoria} = require('../models')


const obtenerCategorias = async(req = request, res = response)=> {

    const querys = req.query
    const {limit = 5, desde = 0, estado = true } = querys


    const [categorias, total] = await Promise.all([
        Categoria.find({estado})
            .populate('usuario', 'name')
            .skip(Number(desde))
            .limit(Number(limit)),
            Categoria.countDocuments({estado}),
    ]) 

    res.json({
        total,
        categorias,
    })
    
}

const obtenerCategoria = async(req = request, res = response)=> {

    const idCategoria = req.params.id;
    
    const categoria = await Categoria.findById(idCategoria)
                                     .populate('usuario', 'name');
    
    if(!categoria){
        res.status(400).json({
            message: 'La categoria no existe en nuestra DB'
        })
    }

    res.json({
        categoria
    })

}


const crearCategoria = async( req = request, res = response)=> {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre})

    if(categoriaDB){
        res.status(400).json({
            message: 'La categoria ya existe'
        })
    }

    const data = {
        nombre,
        usuario: req.usuario._id,
    }

    const categoria = new Categoria(data);

    await categoria.save();

    res.status(201).json(categoria);

}

const actualizarCategoria = async( req = request, res = response)=> {

    const {id} = req.params;

    const {estado, usuario,...data} = req.body;
    const nombre = req.body.nombre.toUpperCase()

    const categoriaDB = await Categoria.findOne({nombre})

    if(categoriaDB){
        res.status(400).json({
            message: 'La categoria ya existe'
        })
    }

    data.nombre = req.body.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    //entre las opciones del findByIdAndUpdate puedes mandar una tercera opcion como new para que siempre mande la nueva version actualizada
    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});

    res.json({
        categoria,
    })
}

const eliminarCategoria = async(req = request, res = response)=> {

    const {id} = req.params;

    const categoriaDB = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true})
                                       .populate('usuario', 'name' );

    if(!categoriaDB){
        res.status(400).json({
            message: 'La categoria no existe en nuestra DB'
        })
    }

    res.json({
        message: 'Categoria eliminada de la db',
        categoriaDB
    })

}


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    eliminarCategoria
}