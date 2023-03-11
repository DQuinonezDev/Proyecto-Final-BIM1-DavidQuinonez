const { request, response } = require('express');
const Producto = require('../models/producto');


const validarStock = async (req = request, res = response, next) => {
    const { productos, stock } = req.body;

        const productoDB = await Producto.findById(Producto.stock);
        if (productoDB) {
            if (!productoDB) {
                return res.status(400).json({
                    msg: "El producto no se encuentra en la base de datos",
                });
            }

            if (stockDisponible > productoDB.cantidad) {
                return res.status(405).json({
                    msg: `El producto no tiene esa cantidad`,
                });
            }
        }
    // }

    next();
};

module.exports = {
    validarStock,
}