const { Schema, model } = require('mongoose');

const FacturaSchema = Schema({
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },

    carrito: {
        type: Schema.Types.ObjectId,
        ref: 'CarritoCompra',
        required: true
    },
    fechaActual: {
        type: Date,
        default: Date.now()
    }

});


module.exports = model('factura', FacturaSchema);