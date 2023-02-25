//Clase modelo del proyecto

const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre de la categoria es obligatorio']
    },
    imgenes: {
        type: String,
    },
    descripcion: {
        type: String,
        required: [true, 'La descripcion es obligatoria']
    },
    estado: {
        type: Boolean,
        default: true
    }

})

//* El nombre de conexiones siempre tiene que ir en sigular ya que mongo siempre añade una s al final 
module.exports = model('Categoria', CategoriaSchema)