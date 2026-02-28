// rutas de usuario
// host + /api/auth

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { newUser, loginUser, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/fieldValidator');
const { validarJWT } = require('../middlewares/validateJWT');

router.post(
    '/new', 
    [ // middlewares
        check('name', 'el nombre es obligatorio').not().isEmpty(),
        check('email', 'el email es obligatorio').isEmail(),
        check('password', 'el password debe ser de 6 caracteres').isLength({min:6}),
        validarCampos
    ],
    newUser
);

router.post(
    '/', 
    [
        check('email', 'el email es obligatorio').isEmail(),
        check('password', 'el password debe ser de 6 caracteres').isLength({min:6}),
        validarCampos
    ],
    loginUser
);

router.get('/renew', validarJWT, renewToken);

module.exports = router;