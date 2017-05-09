const EstudianteModel = require('../models/estudiante.model');
const ParaleloModel = require('../models/paralelo.model');
const LeccionModel = require('../models/leccion.model');
const GrupoModel = require('../models/grupo.model');
const co = require('co')

var respuesta = require('../utils/responses');
/*
* Estudiante metodos basicos
*/
const obtenerTodosEstudiantes = (req, res) => {
  EstudianteModel.obtenerTodosEstudiantes((err, estudiantes) => {
    if (err) return respuesta.serverError(res);
    return respuesta.ok(res, estudiantes);
  })
}

const crearEstudiante = (req, res) => {
  let estudiante = new EstudianteModel({
    nombres: req.body.nombres,
    apellidos: req.body.apellidos,
    correo: req.body.correo,
    matricula: req.body.matricula
  })
  estudiante.crearEstudiante((err) => {
    if (err) return respuesta.serverError(res);
    return respuesta.creado(res, estudiante);
  })
}

const obtenerEstudiante = (req, res) => {
	EstudianteModel.obtenerEstudiante(req.params.id_estudiante, (err, estudiante) => {
    if (err) return respuesta.serverError(res);
    return respuesta.ok(res, estudiante);
  })
}

// mensajes error dos: si no es del curso, o si ingreso mal la contrasena leccion
// restrigir acceso al lecciones si no ha ingresado el codigo
// TODO: IMPORTANTE CALLBACK HELL
const verificarEstudiantePuedeDarLeccion = (req, res) => {
  const { _id } = req.session
  const { codigo_leccion } = req.params
  ParaleloModel.obtenerParaleloDeEstudiante(_id, (err, paralelo) => {
    if (err) {
      return respuesta.serverError(res)
    }else if (paralelo.dandoLeccion) {
      GrupoModel.obtenerGrupoDeEstudiante(_id, (err, grupo) => {
        if (err ) return respuesta.serverError(res)
        if (!grupo) {
          return respuesta.noOKMensaje(res, {mensaje: 'no_esta_anadido_a_paralelo'})
        } else {
          LeccionModel.obtenerLeccionPorCodigo(codigo_leccion, (err, leccion) => {
            if (err) return respuesta.serverError(res);
            if (!leccion) return respuesta.noOK(res);
            if (leccion.paralelo === paralelo._id) {
              EstudianteModel.anadirEstudianteDandoLeccion(_id, leccion._id,  (err, estudiante) => {
                if (err) return respuesta.serverError(res);
                if (!estudiante) return respuesta.noOK(res);
                EstudianteModel.anadirLeccionActualDando(_id, leccion._id, (err, est) => {
                  if (err) return respuesta.serverError(res)
                  req.app.set('habilitado_para_leccion', true)
                  if (leccion.leccionYaComenzo) {
                    return respuesta.ok(res, {'mensaje': 'leccion_empezo'})
                  } else {
                    return respuesta.okAnadido(res);
                  }
                // TODO: setearle al estudiante la leccion y que la esta dando
                })
              })
            } else {
              return respuesta.noOK(res, {'mensaje': 'codigo_mal_ingresado'})
            }
          })
        }
      })
    } else {
      return respuesta.noOK(res); // DOCUMENTACION
    }
  })
}


const verificarPuedeDarLeccion = (id_estudiante, callback) => {
  EstudianteModel.veficarPuedeDarLeccion(id_estudiante, (err, estudiante) => {
    if (err) return callback(err)
    return callback(estudiante.dandoLeccion)
  })
}

const calificarLeccion = (req, res) => {
  EstudianteModel.calificarLeccion(req.params.id_estudiante, req.params.id_leccion, req.body.calificacion, (err, doc) => {
    if (!doc.nModified) return respuesta.mongoError(res, 'La leccion no existe');
    if(err) return respuesta.serverError(res);
    return respuesta.okActualizado(res);
  })
}


const EditarANoesperandoLeccion = (req, res) => {
  EstudianteModel.esperandoLeccion(req.session.id, (err, res) => {
    if (err) return respuesta.mongoError(res, 'Editar a no esperando leccion');
    return respuesta.okActualizado(res)
  })
}

const ingresadocodigoLeccion = (req, res) => {
  console.log('dsfds');
  console.log(req.session._id);
  EstudianteModel.codigoLeccion(req.session._id, (err, anadido) => {
    if (err) return respuesta.mongoError(res, 'La leccion no existe');
    return respuesta.okActualizado(res)
  })
}


module.exports = {
	obtenerTodosEstudiantes,
	crearEstudiante,
	obtenerEstudiante,
  // leccion
  verificarEstudiantePuedeDarLeccion,
  verificarPuedeDarLeccion,
  calificarLeccion,
  EditarANoesperandoLeccion,
  ingresadocodigoLeccion
}
