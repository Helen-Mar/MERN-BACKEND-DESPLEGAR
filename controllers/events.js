const { response } = require('express');
const event = require('../models/event')

const getEvents = async (req, res = response) => {
    const eventos = await event.find().populate('user','name');

    res.json({
        ok: true,
        eventos
    });
}

const createEvent = async (req, res = response) => {
    const evento = new event(req.body);

    try {
        evento.user = req.uid;
        await evento.save();
    
        res.status(201).json({
            ok: true,
            evento
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'hable con el administrador'
        });
    }
}

const updateEvent = async (req, res = response) => {
    const uid = req.uid;
    const eventId = req.params.id;

    try {
        const evento = await event.findById(eventId);
        if (!evento) {
            res.status(404).json({
                ok: false,
                msg: 'evento no existe por ese id'
            });
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'no tiene privilegio de editar este evento'
            });
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        const eventUpdated = await event.findByIdAndUpdate(eventId, newEvent, {new: true});
    
        res.json({
            ok: true,
            evento: eventUpdated
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'hable con el administrador'
        })
    }
}

const deleteEvent = async (req, res = response) => {
    const uid = req.uid;
    const eventId = req.params.id;

    try {
        const evento = await event.findById(eventId);
        if (!evento) {
            res.status(404).json({
                ok: false,
                msg: 'evento no existe por ese id'
            });
        }
        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'no tiene privilegio de eliminar este evento'
            });
        }
        const eventDeleted = await event.findByIdAndDelete(eventId);

        res.json({
            ok: true,
            evento: eventDeleted
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'hable con el administrador'
        })
    }
}

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}