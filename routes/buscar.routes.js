const {Router} = require('express');
const { check } = require('express-validator');
const { buscar } = require('../controllers/buscar.controller');

/* const { idProductoExiste, idCategoriaExiste } = require('../helpers/db-validator'); */
/* 
const {validarCampos} = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const { esAdminRole } = require('../middleware/validar-roles'); */


const router = Router();

router.get('/:coleccion/:termino', buscar);


module.exports = router;