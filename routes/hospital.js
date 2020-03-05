var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Hospital = require('../models/hospital');
// ==========================================
// Obtener hospital por id
// ==========================================

app.get('/:id', (req, res) => {

  var id = req.params.id;

  Hospital.findById(id).populate('hospital', 'nombr img email')
    .exec((err, hospital) => {

      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error buscando hospital',
          errors: err
        });
      }

      if (!hospital) {
        return res.status(400).json({
          ok: false,
          mensaje: 'No existe hospital con ID: ' + id,
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        hospital: hospital
      });
    })

})

// ==========================================
// Obtener todos los hospitales
// ==========================================
app.get('/', (req, res, next) => {

  var desde = req.query.desde || 0;
  desde = Number(desde);


  Hospital.find({})
    .populate('hospital', 'nombre email')
    .skip(desde)
    .limit(5)
    .exec(
      (err, hospitales) => {

        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error cargando hospital',
            errors: err
          });
        }
        Hospital.count({}, (error, conteo) => {
          res.status(200).json({
            ok: true,
            hospitales: hospitales,
            total: conteo
          });


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
    hospital: req.hospital._id
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
    });
  });

});

// ==========================================
// Actualizar hospital
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

  var id = req.params.id;
  var body = req.body;

  Hospital.findById(id, (err, hospital) => {


    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar hospital',
        errors: err
      });
    }

    if (!hospital) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El hospital con el id ' + id + ' no existe',
        errors: {
          message: 'No existe un hospital con ese ID'
        }
      });
    }


    hospital.nombre = body.nombre;
    hospital.usuario = req.usuario._id;

    hospital.save((err, hospitalGuardado) => {

      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al actualizar hospital',
          errors: err
        });
      }


      res.status(200).json({
        ok: true,
        hospital: hospitalGuardado
      });

    });

  });

});



// ============================================
//   Borrar un hospital por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

  var id = req.params.id;

  Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error borrar hospital',
        errors: err
      });
    }

    if (!hospitalBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: 'No existe un hospital con ese id',
        errors: {
          message: 'No existe un hospital con ese id'
        }
      });
    }

    res.status(200).json({
      ok: true,
      hospital: hospitalBorrado
    });

  });

});



module.exports = app;