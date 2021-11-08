const {Router} = require('express');
const { check } = require('express-validator');
const { usuariosGet, usuariosDelete, usuariosPut, usuariosPatch, usuariosPost } = require('../controllers/usuarios.controller');
const { validarRol, emailExiste, idExiste } = require('../helpers/db-validator');
const {validarCampos} = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const { esAdminRole, tieneRole } = require('../middleware/validar-roles');



const router = Router();

router.get('/', usuariosGet)

router.post('/', [
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('password', 'La contraseña debe ser mayor a 6 digitos').isLength({min: 6}),
    check('correo', 'el correo no es valido').isEmail(),
    check('correo').custom(emailExiste),
    check('rol').custom(validarRol),
    validarCampos,
],usuariosPost);

router.delete('/:id',[
    validarJWT,
    /* esAdminRole, */
    tieneRole('USER_ROLE', 'ADMIN_ROLE'),
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(idExiste),
    validarCampos
], usuariosDelete);

router.put('/:id',[
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(idExiste),
    check('rol').custom(validarRol),
    validarCampos
], usuariosPut);

router.patch('/', usuariosPatch);

module.exports = router;