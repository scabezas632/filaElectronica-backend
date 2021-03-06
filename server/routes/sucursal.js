const express = require('express');
const Sucursal = require('../models/sucursal');
const moment = require('moment');

const app = express();

app.get('/sucursal', function(req, res) {

    // Si se busca por alguna comuna en especifico
    // de lo contrario se buscan todas las sucursales
    let query = {};
    let queryComuna = {};
    if (req.query.nombre) query['nombre'] = req.query.nombre;
    if (req.query.comuna) queryComuna['nombre'] = req.query.comuna;
    
    Sucursal.find(query)
        .populate({
            path: 'direccion horario horarioEspecial',
            populate: {
                path: 'comuna',
                match: queryComuna,
                populate: {
                    path: 'region'
                }
            }
        })
        .exec((err, sucursales) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };
            
            sucursales = sucursales.filter(function(sucursal) {
                return sucursal.direccion.comuna;
            });


            res.json({
                ok: true,
                sucursales,
                length: sucursales.length
            })

        })

})

app.post('/sucursal', function(req, res) {
    let body = req.body;

    let sucursal = new Sucursal({
        nombre: body.nombre,
        telefono: body.telefono,
        direccion: body.direccion,
        gerente: body.gerente,
        horario: body.horario,
        horarioEspecial: body.horarioEspecial
    });

    sucursal.save((err, sucursalDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            sucursal: sucursalDB
        })

    });

})

app.put('/sucursal/:id', function(req, res) {
    let id = req.params.id;

    Sucursal.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }, (err, sucursalDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            sucursal: sucursalDB
        })
    });
})

app.delete('/sucursal/:id', function(req, res) {

    let id = req.params.id;

    // Eliminar registro
    Sucursal.findByIdAndRemove(id, (err, sucursalBorrado) => {

        // Cambiar estado del registro
        // sucursal.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, sucursalDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            sucursal: sucursalBorrado
        })
    });

})

module.exports = app;