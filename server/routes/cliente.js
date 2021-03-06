const express = require('express');
const Cliente = require('../models/cliente');

const _ = require('underscore');

const app = express();

app.get('/cliente', function(req, res) {

    Cliente.find({})
        .exec((err, clientes) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };

            Cliente.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    clientes,
                    length: conteo
                })
            });

        })

})

app.get('/cliente/:rut', function(req, res) {

    let query = {};
    let rut = req.params.rut;
    let idFacebook = req.query.idFacebook;
    if(rut) query['rut'] = rut;
    if(idFacebook) query['idFacebook'] = idFacebook;

    Cliente.findOne(query)
        .exec((err, clientes) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };

            Cliente.count(query, (err, conteo) => {
                res.json({
                    ok: true,
                    clientes,
                    length: conteo
                })
            });

        })

})

app.post('/cliente', function(req, res) {
    let body = req.body;


    let cliente = new Cliente({
        nombre: body.nombre,
        rut: body.rut,
        email: body.email,
        ultimaVisita: body.ultimaVisita,
        idFacebook: body.idFacebook,
        estado: body.estado
    });

    cliente.save((err, clienteDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            cliente: clienteDB
        })

    });

})

app.put('/cliente/:id', function(req, res) {
    let id = req.params.id;
    // Campos que pueden ser modificados en el put
    let body = _.pick(req.body, ['nombre', 'email', 'feNaci']);

    Cliente.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, clienteDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            cliente: clienteDB
        })
    });
})

app.delete('/cliente/:id', function(req, res) {

    let id = req.params.id;

    // Eliminar registro
    Cliente.findByIdAndRemove(id, (err, clienteBorrado) => {

        // Cambiar estado del registro
        // Cliente.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, clienteDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            cliente: clienteBorrado
        })
    });

})

module.exports = app;