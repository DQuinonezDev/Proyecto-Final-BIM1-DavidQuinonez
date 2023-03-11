//? Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getCarrito, getCarritoAdmin, postCarrito, putCarrito, deleteCarrito } = require('../controllers/carrito-compras');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');

//? RUTAS
const router = Router();

router.get('/mostrarAdmin', getCarritoAdmin);


router.get('/mostrar',[
    validarJWT,
    tieneRole('CLIENT'),
    validarCampos
], getCarrito);

router.post('/agregar',[
    validarJWT,
    tieneRole('CLIENT'),
    validarCampos

], postCarrito);

router.put('/editar/', putCarrito);

router.delete('/eliminar/:idProducto',[
    validarJWT,
    validarCampos
], deleteCarrito);

module.exports = router;
