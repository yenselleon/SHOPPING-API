const {Router} = require('express');
const { check } = require('express-validator');
const { login, googleLogin } = require('../controllers/auth.controller');
const {validarCampos} = require('../middleware/validar-campos')


const router = Router();

router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);

router.post('/google',[
    check('id_token', 'el password es obligatorio').not().isEmpty(),
    validarCampos
], googleLogin);


module.exports = router;