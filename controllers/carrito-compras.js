//! Importaciones Escenciales
const { response, request } = require('express');

//! Importacion del modelo
const Carrito = require('../models/carrito-compras');
const producto = require('../models/producto');
const Producto = require("../models/producto");


//*CUALQUIER USUARIO CON ROL 'ADMIN' PODRA VER LOS CARRITOS DE LOS CLIENTES
const getCarritoAdmin = async (req = request, res = response) => {

    // Categoria con productos = true se mostraran solo las que tengan productos (true)
    // const query = { estado: true };

    const listaCarrito = await Promise.all([
        Carrito.countDocuments(query),
        Carrito.find(query)
    ]);

    //* Motrando las categorias que estan activas o tienen productos
    res.json({
        msg: `get Api - Carrito del usuario`,
        listaCarrito
    });
}


//* Mostrar el carrito del usuario
const getCarrito = async (req = request, res = response) => {

    const query = { usuario: req.usuario._id }
    const listaCarrito = await Promise.all([
        Carrito.countDocuments(query),
        Carrito.find(query)
            .populate('productos', 'nombre')
            .populate('usuario', 'nombre , correo')
    ]);

    res.json({
        msg: `get Api - Carrito de compras`,
        listaCarrito
    });
}


const postCarrito = async (req = request, res = response) => {
    
        const carrito = await Carrito.findOne({ usuario: req.usuario._id });
        const precio = await Producto.findOne(producto.precio);
        if (!carrito) {
            // Si el carrito no existe, creamos uno nuevo
            const nuevoCarrito = new Carrito({
                usuario: req.usuario._id,
                productos: [{ producto: req.body.producto, cantidad: req.body.cantidad }],
                precioTotal: 15 // Inicializamos el precio total 
            });
            // Guardamos el carrito y devolvemos el resultado
            await nuevoCarrito.save();
            return res.status(201).json(nuevoCarrito);
        } else {
            // Si el carrito ya existe, buscamos si el producto ya está en el carrito
            const productoEnCarrito = carrito.productos.find(
                (p) => p.producto.toString() === req.body.producto.toString()
            );
            //Iniciamos el total
            if (productoEnCarrito) {
                // Si el producto ya está en el carrito, actualizamos la cantidad
                productoEnCarrito.cantidad += req.body.cantidad;
                // Buscamos el producto en la base de datos para obtener su precio
                const producto = await Producto.findById(productoEnCarrito.producto);
                // Calculamos el precio del producto y lo sumamos al precio total del carrito
                carrito.precioTotal += producto.precio * req.body.cantidad;
                await carrito.save();
                return res.status(200).json(carrito);
            } else {
                // Si el producto no está en el carrito, lo agregamos
                carrito.productos.push({ producto: req.body.producto, cantidad: req.body.cantidad });
                // Buscamos el producto en la base de datos para obtener su precio
                const producto = await Producto.findById(req.body.producto);
                // Calculamos el precio del producto y lo sumamos al precio total del carrito
                carrito.precioTotal += producto.precio * req.body.cantidad;
                await carrito.save();
                return res.status(200).json(carrito);
            }
        }

};



const putCarrito = async (req = request, res = response) => {

}


//* Eliminando Categorias via el estado
const deleteCarrito = async (req = request, res = response) => {

    //Buscando el carrito del usuario por el token
    const carrito = await Carrito.findOne({ usuario: req.usuario._id });

    if (!carrito) {
        return res.status(404).json({ error: 'El carrito de compras no existe.' });
    }

    if (!carrito) {
        return res.status(404).json({ error: 'El carrito no existe' });
    }

    const productoIndex = carrito.productos.findIndex(producto => producto.producto.toString() === req.params.idProducto);

    if (productoIndex === -1) {
        return res.status(404).json({ error: 'El producto no existe en el carrito' });
    }

    const productoEliminado = carrito.productos.splice(productoIndex, 1)[0];

    if (carrito.productos.length > 1) {
        carrito.precioTotal = carrito.productos.reduce((total, producto) => {
            return total + producto.producto.precio * producto.cantidad;
        });
    } else {
        carrito.precioTotal = 15;
    }

    await carrito.save();

    res.json({ mensaje: 'Producto eliminado del carrito', productoEliminado });

}

// const productoEnCarrito = carrito.productos.find(p => p.producto.toString() === req.params.idProducto);

module.exports = {
    getCarrito,
    postCarrito,
    putCarrito,
    deleteCarrito,
    getCarritoAdmin
}
