const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const user = require('../models/user');

const newUser = async (req, res = response) => {
    const {email, password} = req.body;

    try {
        let usuario = await user.findOne({email});
        
        if (usuario) return res.status(400).json({
            ok: false,
            msg: 'correo ya registrado'
        });

        usuario = new user(req.body);

        // encriptar
        // generar salt
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);
    
        await usuario.save();

        //! generar jwt
        const token = await generarJWT(usuario.id, usuario.name);
    
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'porfavor hable con el admin'
        })
    }
}

const loginUser = async (req, res = response) => {
    const {email, password} = req.body;

    try {
        let usuario = await user.findOne({email});
        
        if (!usuario) return res.status(400).json({
            ok: false,
            msg: 'el usuario no existe con ese email'
        });

        // confirmar password
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'password incorrecta'
            })
        }

        // generar json web token
        const token = await generarJWT(usuario.id, usuario.name);
    
        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'porfavor hable con el admin'
        })
    }
}

const renewToken = async (req, res = response) => {
    const uid = req.uid;
    const name = req.name;

    // generar un nuevo jwt y retornarlo en esta peticion
    const token = await generarJWT(uid, name);

    res.json({
        ok: true, 
        uid,
        name,
        token, 
    });
}

module.exports = {
    newUser,
    loginUser,
    renewToken
}