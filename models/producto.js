const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio'],
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    precio: {
        type: Number,
        required:true,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true,
        default: '640ab36c7e86a57ea60431a2'
    },
    descripcion: {
        type: String
    },
    stock: {
        type: Number,
        required: true
    },
    ventas: {
        type: Number,
        default: 0
    }
});



module.exports = model('Producto', ProductoSchema);