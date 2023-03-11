const { request, response } = require('express');
const Factura = require('../models/facturas');
const Carrito = require('../models/carrito-compras');
const Producto = require("../models/producto");




const getFacturas = async (req = request, res = response) => {

    //condiciones del get

    const listaFactura = await Promise.all([
        Factura.countDocuments(),
        Factura.find()
            .populate('admin', 'nombre correo')
            .populate('carrito')

        //Carrito.find(query).populate('productos')
    ]);

    res.json({
        msg: 'get Api - Controlador Usuario',
        listaFactura
    });

}

const getFacturaPorID = async (req = request, res = response) => {
    const { id } = req.params;
    const facturaById = await Factura.findById(id)
        //.populate('usuario', 'nombre')
        .populate('admin', 'correo')
        .populate('cliente', 'nombre')
        .populate('carrito',)

    res.status(201).json(facturaById);

}

const postFactura = async (req = request, res = response) => {

    const { admin, fecha, cantidad, ...body } = req.body;
    //Generar la data a guardar
    const data = {
        ...body,
        admin: req.usuario._id,
        fecha: Date.now()
    }


    console.log(stock);
    //Guardar en DB

    // if (cantidad !== stock) {
    //     return res.status(400).json({ msg: 'No hay el suficiente stock' })
    // } else {
    //     const factura = await Factura(data);
        await factura.save();

        res.status(201).json({
            msg: "Stock Suficiente ",
            factura});

    // }

}





module.exports = {
    getFacturas,
    getFacturaPorID,
    postFactura,

}