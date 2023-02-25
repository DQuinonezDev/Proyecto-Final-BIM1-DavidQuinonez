//! Importaciones Escenciales
const { response, request } = require('express');
const bcrypt = require('bcryptjs');

//! Importacion del modelo
const Categoria = require('../models/categoriaModel');



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

    //* Desestructuración de campos obligatorios
    const { nombre, descripcion } = req.body; //*Esto se muestra en pantalla
    const categoriaGuardadoDB = new Categoria({ nombre, descripcion });

    //! Guardar el campo en Base de datos MongoDb
    await categoriaGuardadoDB.save();

    res.json({
        msg: 'POST Api - post de Categoria (agregando datos)',
        // nombre,
        // descripcion,
        categoriaGuardadoDB
    });
}


//* Editando categoria
const putCategoria = async (req = request, res = response) => {


    //? Req.params sirve para traer parametros de las rutas
    const { id } = req.params;

    //? ...resto es hasta aca llegamos, se modifican los datos que no estan antes del ..resto. lo que ya no se puede cambiar el resto de cosas que quedam
    const { _id, img, estado, ...resto } = req.body;
    //? Los parametros img, rol, estado no se modifican pero los demas si por el ...resto


    //? editar el usuario con el id
    const categoriaEditada = await Categoria.findByIdAndUpdate(id, resto);

    res.json({
        msg: 'PUT api - Editando Categoria',
        id,
        categoriaEditada
    });
}


//* Eliminando Categorias via el estado
const deleteCategoria = async (req = request, res = response) => {
    //Req.params sirve para traer parametros de las rutas
    const { id } = req.params;

    //*Eliminando de la base de datos Fisicamente
    // const categoriaEliminada = await Categoria.findByIdAndDelete(id);

    //*Eliminando de la base de datos por estado
    const caegoriaEliminada = await Categoria.findByIdAndUpdate(id, { estado: false });

    res.json({
        msg: 'DELETE api - Eliminando Categoria via estado',
        id,
        caegoriaEliminada
    });
}

module.exports = {
    getCategoria,
    postCategoria,
    putCategoria,
    deleteCategoria
}
