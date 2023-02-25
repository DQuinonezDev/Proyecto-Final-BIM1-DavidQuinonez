//Clase modelo del proyecto

const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre del usuario es obligatorio']
    },
    rol: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    }, 
    correo: {
        type: String, 
        required: true
    },
    password:{
        type: String,
        required:true
    }

})

//* El nombre de conexiones siempre tiene que ir en sigular ya que mongo siempre añade una s al final 
module.exports = model('Usuario', UsuarioSchema)