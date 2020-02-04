var express = require('express');

const fileUpload = require('express-fileupload');

var app = express();


// default options
app.use(fileUpload());

app.put('/', (req, res, next) => {

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      mensaje: 'No selecciono nada',
      errors: {
        message: 'debe de selccionar una imagen'
      }
    });
  }

  //Obtener nombre archivo
  var archivo = req.files.imagen;
  var nombreCortado = archivo.name.split('.');
  var extensionArchivo = nombreCortado[nombreCortado.length - 1];

  //Extensiones aceptadas

  var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

  if (extensionesValidas.indexOf(extensionArchivo) < 0) {

    return res.status(400).json({
      ok: false,
      mensaje: 'Extension no valida',
      errors: {
        message: 'Las extensiones validas son ' + extensionesValidas.join(', ')
      }
    });
  }


  res.status(200).json({
    ok: true,
    mensaje: ' Peticion realizada correctamente',
    extensionArchivo: extensionArchivo
  })

});



module.exports = app;