const {Router} = require('express');
const { check } = require('express-validator');
const { obtenerProductos,
        crearProducto,
        obtenerProducto,
        actualizarProducto,
        eliminarProducto } = require('../controllers/producto.controller');
const { idProductoExiste, idCategoriaExiste } = require('../helpers/db-validator');

const {validarCampos} = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const { esAdminRole } = require('../middleware/validar-roles');


const router = Router();

//Get - Todos los productos
router.get('/', obtenerProductos);

//Get - Producto por ID
router.get('/:id',[
    check('id', 'No es un ID valido').isMongoId(),
    check('id', 'No es un ID valido').custom(idProductoExiste),
    check('categoria', 'La indenticacion de la categoria debe de ser valida').isMongoId(),
    check('categoria', 'la categoria no existe en nuestra db').custom(idCategoriaExiste),
    validarCampos,
],obtenerProducto)

//Post - Crear Procuto
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'el id de la categoria no es valida').isMongoId(),
    check('categoria', 'la categoria es obligatoria').not().isEmpty(),
], crearProducto)

//PUT - Actualizar Procuto
router.put('/:id',[
    validarJWT,
    esAdminRole,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un ID valido').isMongoId(),
    check('id', 'El id no esta registrado').custom(idProductoExiste),
    check('categoria', 'La indenticacion de la categoria debe de ser valida').isMongoId(),
    check('categoria', 'la categoria no existe en nuestra db').custom(idCategoriaExiste),
    validarCampos,
],actualizarProducto)

//DELETE - Eliminar Procuto
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id', 'No es un ID valido').custom(idProductoExiste),
    validarCampos,
],eliminarProducto)



module.exports = router;