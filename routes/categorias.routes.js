const {Router} = require('express');
const { check } = require('express-validator');
const { crearCategoria,
        obtenerCategorias,
        obtenerCategoria,
        actualizarCategoria, 
        eliminarCategoria} = require('../controllers/categorias.controller');
const { idCategoriaExiste } = require('../helpers/db-validator');

const {validarCampos} = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const { esAdminRole } = require('../middleware/validar-roles');


const router = Router();

//Obtener todas las categorias
router.get('/', obtenerCategorias);

/* Obtener una categoria por id - publico */
router.get('/:id', [
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(idCategoriaExiste),
    validarCampos,
],obtenerCategoria);

//Crear categoria - privado - cualquier persona con un token valido
router.post('/',[
    validarJWT,
    check('nombre', 'el nombre de la categoria es necesario').not().isEmpty(),
    validarCampos,
],crearCategoria);

//Actualizar categoria - privado - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(idCategoriaExiste),
    check('nombre', 'el nombre de la categoria es necesario').not().isEmpty(),
    validarCampos,
],actualizarCategoria)


//Borrar categoria - privado - cualquier persona con un token valido
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(idCategoriaExiste),
    validarCampos,
],eliminarCategoria)

module.exports = router;