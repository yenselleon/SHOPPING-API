const {Router} = require('express');
const { check } = require('express-validator');
const { subirArchivos, actualizarImagenCloudinary, mostrarImagen } = require('../controllers/uploads.controller');
const { coleccionesPermitidas } = require('../helpers/db-validator');
const { validarArchivosSubidos } = require('../helpers/validar-archivo');


const {validarCampos} = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const { esAdminRole } = require('../middleware/validar-roles');


const router = Router();


router.post('/',validarArchivosSubidos, subirArchivos);

router.put('/:coleccion/:id', [
    validarArchivosSubidos,
    check('id', 'El id no es un id valido').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas( c, ['usuarios', 'productos'] )),
    validarCampos
] ,actualizarImagenCloudinary);

router.get('/:coleccion/:id', [
    check('id', 'El id no es un id valido').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas( c, ['usuarios', 'productos'] )),
    validarCampos
] ,mostrarImagen);

module.exports = router;