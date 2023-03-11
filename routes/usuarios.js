const { Router } = require('express');
const { check } = require('express-validator');
const { getUsuarios, postUsuario, putUsuario, deleteUsuario, getUsuariosClient, getUsuariosAdmin, deleteCliente, postCliente, deleteClienteU} = require('../controllers/usuario');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');

//? RUTAS
const router = Router();

router.get('/mostrar', getUsuarios);

router.get('/mostrarClient', getUsuariosClient);

router.get('/mostrarAdmin', getUsuariosAdmin);



router.post('/agregar', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 digitos').isLength({ min: 6 }),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExiste),
    validarCampos,
], postUsuario);

router.post('/agregarCliente', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 digitos').isLength({ min: 6 }),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExiste),
    validarCampos,
], postCliente);

router.put('/editar/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 digitos').isLength({ min: 6 }),
    // check('correo', 'El correo no es valido').isEmail(),
    // check('correo').custom(emailExiste),
    validarCampos
], putUsuario);


router.delete('/eliminar/', [
    validarJWT,
    esAdminRole,
    validarCampos
], deleteUsuario);

router.delete('/eliminar/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),

    validarCampos
], deleteCliente);

router.delete('/eliminarU/', [
    validarJWT,

    validarCampos
], deleteClienteU);

module.exports = router;
