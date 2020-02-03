var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');


// ==========================================
// Obtener todos los hospitales
// ==========================================
app.get('/', (req, res, next) => {

  Hospital.find({})
    .exec(
      (err, hospitales) => {

        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error cargando hospital',
            errors: err
          });
        }
        res.status(200).json({
          ok: true,
          hospitales: hospitales
        });

      }
    )
});

// ==========================================
// Crear un nuevo hospital
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

  var body = req.body;

  var hospital = new Hospital({
    nombre: body.nombre,
    img: body.img,
    usuario: body.usuario,
    role: body.role
  });

  hospital.save((err, hospitalGuardado) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al crear hospital',
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      hospital: hospitalGuardado,
      hospitaltoken: req.hospital
    });


  });

});




module.exports = app;