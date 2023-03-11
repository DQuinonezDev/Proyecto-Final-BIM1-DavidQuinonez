const { Router } = require('express');
const { check } = require('express-validator');
const { postFactura, getFacturas, getFacturaPorID } = require('../controllers/facturas');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarStock } = require('../middlewares/validar-stock.js');

const router = Router();

//Manejo de rutas

//Obtener todas las categorias - publico
router.get('/mostrar', getFacturas);

 router.get('/:id', [
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    validarCampos
], getFacturaPorID);
    
//Crear categoria si el usuario esta logeado - privada - token valido
router.post('/agregar', [
    validarJWT,
    validarStock,
    validarCampos
],postFactura);

module.exports = router;