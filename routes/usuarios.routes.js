const {Router} = require('express');
const { check } = require('express-validator');
const { usuariosGet, usuariosDelete, usuariosPut, usuariosPatch, usuariosPost } = require('../controllers/usuarios.controller');
const {validarCampos} = require('../middleware/validar-campos')

const router = Router();

router.get('/', usuariosGet)

router.post('/', [
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('password', 'La contraseña debe ser mayor a 6 digitos').isLength({min: 6}),
    check('correo', 'el correo no es valido').isEmail(),
    check('rol', 'El rol no es valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    validarCampos,
],usuariosPost);

router.delete('/', usuariosDelete);

router.put('/:id', usuariosPut);

router.patch('/', usuariosPatch);

module.exports = router;