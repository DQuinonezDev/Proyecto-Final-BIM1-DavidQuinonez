//! Importaciones Escenciales
const { response, request } = require('express');
const bcrypt = require('bcryptjs');

//! Importacion del modelo
const Categoria = require('../models/categoriaModel');
const Producto = require('../models/producto');



//* Mostrar las categorias
const getCategoria = async (req = request, res = response) => {

    // Categoria con productos = true se mostraran solo las que tengan productos (true)
    const query = { estado: true };

    const listaCategoria = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
    ]);

    //* Motrando las categorias que estan activas o tienen productos
    res.json({
        msg: 'get Api - Datos de Categorias',
        listaCategoria
    });
}

//* Agregando Categorias
const postCategoria = async (req = request, res = response) => {
    
    const _id = req.usuario._id;

    const { estado, usuario, ...body } = req.body;

    const categoriaDB = await Categoria.findOne({ nombre: body.nombre.toUpperCase() });
    // const productoDB = await Producto.findOne({ nombre: body.nombre });

    //validacion si el producto ya existe
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe en la DB`
        });
    } else {
        const data = {
            ...body,
            nombre: body.nombre.toUpperCase(),
            usuario: _id,
        }

        const categoria = await Categoria(data);

        //Guardar en DB
        await categoria.save();

        res.status(201).json({
            msg:"POST API - POST CATEGORIA",
            categoria});
    }

    
  
}


//* Editando categoria
const putCategoria = async (req = request, res = response) => {


    //? Req.params sirve para traer parametros de las rutas
    const { id } = req.params;

    //? ...resto es hasta aca llegamos, se modifican los datos que no estan antes del ..resto. lo que ya no se puede cambiar el resto de cosas que quedam
    const { _id, img, ...resto } = req.body;
    //? Los parametros img, rol, estado no se modifican pero los demas si por el ...resto


    //? editar el usuario con el id
    const categoriaEditada = await Categoria.findByIdAndUpdate(id, resto, { new: true });

    res.json({
        msg: 'PUT api - Editando Categoria',
        id,
        categoriaEditada
    });
}


//* Eliminando Categorias via el estado
const deleteCategoria = async (req, res) => {
    const { id } = req.params;

    //? Buscar productos de la categoría a eliminar
    const productos = await Producto.find({ categoria: id });

    // ? Asignar la categoría por defecto a los productos
    const categoriaPorDefecto = await Categoria.findOne({ nombre: 'Sin Categoria' });

    //*Remplazando la categoria eliminada por la que se remplazara
    productos.forEach(async (producto) => {
        producto.categoria = '640bbcd9f0fb26a6dc68f949';
        await producto.save();
    });

    //*Eliminando de la base de datos Fisicamente
    const categoriaEliminada = await Categoria.findByIdAndDelete(id);

    res.json({
        msg: 'Categoría eliminada correctamente.',
        id,
        categoriaEliminada
    });
};

module.exports = {
    getCategoria,
    postCategoria,
    putCategoria,
    deleteCategoria
}
