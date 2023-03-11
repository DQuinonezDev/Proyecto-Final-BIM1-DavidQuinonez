const { request, response, json } = require('express');
const Producto = require('../models/producto');

const getProductos = async (req = request, res = response) => {

    //condiciones del get
    const query = { estado: true };

    const listaProductos = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            //.populate('usuario', 'nombre')
            .populate('usuario', 'nombre , correo')
            .populate('categoria', 'nombre')
    ]);

    
    res.json({
        msg: 'Lista de productos activos',
        listaProductos
    });

}

const getProductosAgotado = async (req = request, res = response) => {

    //condiciones del get
    const query = { stock: 0 };

    const listaProductos = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            //.populate('usuario', 'nombre')
            .populate('usuario', 'nombre , correo')
            .populate('categoria', 'nombre')
    ]);

    
    res.json({
        msg: 'Lista de productos activos',
        listaProductos
    });

}



const getProductoPorId = async (req = request, res = response) => {

    const { id } = req.params;
    const prouductoById = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    res.status(201).json(prouductoById);

}

const getProductosVendidos = async (req = request, res = response) => {

    const query = await Producto.find().sort({ventas: -1}).limit(5);

    res.status(201).json({
        msg: "Lista de productos más vendidos:",
        query
    })

}

const postProducto = async (req = request, res = response) => {
    const _id = req.usuario._id;

    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre.toUpperCase() });
    // const productoDB = await Producto.findOne({ nombre: body.nombre });

    //validacion si el producto ya existe
    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe en la DB`
        });
    } else {
        const data = {
            ...body,
            nombre: body.nombre.toUpperCase(),
            usuario: _id,
        }

        const producto = await Producto(data);

        //Guardar en DB
        await producto.save();

        res.status(201).json(producto);
    }

    //Generar la data a guardar


}

const putProducto = async (req = request, res = response) => {

    const { id } = req.params;
    const { usuario, ...restoData } = req.body;
    const productoDB = await Producto.findOne({ nombre: restoData.nombre.toUpperCase() });

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe en la DB`
        });
    }
    if (restoData.nombre) {
        restoData.nombre = restoData.nombre.toUpperCase();
        restoData.usuario = req.usuario._id;
    }

    const productoActualizado = await Producto.findByIdAndUpdate(id, restoData, { new: true });

    res.status(201).json({
        msg: 'Put Controller Producto',
        productoActualizado
    })

}

const deleteProducto = async (req = request, res = response) => {

    const { id } = req.params;
    //Eliminar fisicamente de la DB
    //const productoEliminado = await Producto.findByIdAndDelete( id );

    //Eliminar por el estado:false
    const productoEliminado_ = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });


    res.json({
        msg: 'DELETE',
        //productoEliminado,
        productoEliminado_
    })

}


module.exports = {
    postProducto,
    putProducto,
    deleteProducto,
    getProductos,
    getProductoPorId,
    getProductosAgotado,
    getProductosVendidos
}
