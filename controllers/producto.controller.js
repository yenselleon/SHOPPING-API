const { request, response } = require("express")
const {Producto, Categoria} = require('../models')


const obtenerProductos = async(req = request, res = response)=> {

    const querys = req.query
    const {limit = 5, desde = 0, estado = true } = querys


    const [productos, total] = await Promise.all([
        Producto.find({estado})
            .populate('usuario', 'name')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limit)),
            Producto.countDocuments({estado}),
    ]) 

    res.json({
        total,
        productos,
    })
    
}

const obtenerProducto = async(req = request, res = response)=> {

    const idProducto = req.params.id;
    
    const producto = await Producto.findById(idProducto)
                                     .populate('usuario', 'name')
                                     .populate('categoria', 'nombre');
    
    if(!producto){
        res.status(400).json({
            message: 'El producto no existe en nuestra DB'
        })
    }

    res.json({
        producto
    })

}


const crearProducto= async( req = request, res = response)=> {

    const {idCategoria,estado, usuario, ...resData} = req.body;

    const nombreProducto = req.body.nombre.toUpperCase()

    const [productoDB, categoriaDB] = await Promise.all([
        Producto.findOne({nombre: nombreProducto}),
        Categoria.findById(idCategoria)
    ])

    if(productoDB){
        return res.status(400).json({
            message: 'El producto ya existe'
        })
    }


    const data = {
        ...resData,
        nombre: nombreProducto,
        usuario: req.usuario._id,
        categoria: req.body.idCategoria
    }

    const producto = new Producto(data);

    await producto.save();

    res.status(201).json(producto);

}

const actualizarProducto = async( req = request, res = response)=> {

    const {id} = req.params;

    const {estado, usuario,...data} = req.body;
    const nombre = req.body.nombre?.toUpperCase()


    data.nombre = req.body.nombre?.toUpperCase();
    data.usuario = req.usuario._id;

    //entre las opciones del findByIdAndUpdate puedes mandar una tercera opcion como new para que siempre mande la nueva version actualizada
    const producto = await Producto.findByIdAndUpdate(id, data, {new: true})
                                    .populate('usuario', 'name')
                                    .populate('categoria', 'nombre');

    res.json({
        producto,
    })
}

const eliminarProducto = async(req = request, res = response)=> {

    const {id} = req.params;

    const productoDB = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true})
                                       .populate('usuario', 'name' )
                                       .populate('categoria', 'nombre');

    if(!productoDB){
        res.status(400).json({
            message: 'La categoria no existe en nuestra DB'
        })
    }

    res.json({
        message: 'Producto eliminado de la db',
        productoDB
    })

}


module.exports = {
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    obtenerProducto,
    eliminarProducto
}