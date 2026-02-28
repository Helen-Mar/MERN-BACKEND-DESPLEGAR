const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { validarJWT } = require('../middlewares/validateJWT');
const { validarCampos } = require('../middlewares/fieldValidator');
const { getEvents, createEvent, updateEvent, deleteEvent } = require("../controllers/events");
const { isDate } = require('../helpers/isDate');

// middleware para todas las peticiones
router.use(validarJWT);

// ENDPOINTS

router.get('/', getEvents);
router.post(
    '/', 
    [
        check('title', 'el titulo es obligatorio').not().isEmpty(),
        check('start', 'fecha de inicio es obligatoria').custom(isDate),
        check('end', 'fecha de finalizacion es obligatoria').custom(isDate),
        validarCampos
    ],
    createEvent
);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;