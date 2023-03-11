//Clase modelo del proyecto

const { Schema, model } = require('mongoose');

const CarritoSchema = Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    productos: [{
        producto: {
            type: Schema.Types.ObjectId,
            ref: 'Producto',
        },
        cantidad: {
            type: Number,
            required: true,
        }
    }],
    precioTotal: {
        type: Number,
        required: true,
    },
})

//* El nombre de conexiones siempre tiene que ir en sigular ya que mongo siempre añade una s al final 
module.exports = model('CarritoCompra', CarritoSchema)