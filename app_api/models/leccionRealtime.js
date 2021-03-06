let mongoose = {}
let db = {}
if (process.env.NODE_ENV === 'production' && process.env.SERVIDOR === 'heroku') {
  mongoose = require('mongoose')
  db = require('mongoose')
} else if (process.env.NODE_ENV) {
  db = require('../../databases/mongo/mongo').getDatabaseConnection()
  mongoose = require('mongoose')
}

mongoose.Promise = global.Promise;
var moment = require('moment')
var tz = require('moment-timezone')

const LeccionRealtimeSchema = mongoose.Schema({
  _id: {
    type: String,
    'default': require('shortid').generate
  },
  leccion: {
    type: String,
    ref: 'Leccion'
  },
  profesor: {
    type: String,
    ref: 'Profesor'
  },
  estudiantesDandoLeccion: [{
    type: String,
    ref: 'Estudiante'
  }],
  estudiantesDesconectados: [{
    type: String,
    ref: 'Estudiante'
  }],
  fechaInicio: {
    type: Date
  },
  corriendoTiempo: {
    type: Boolean,
    'default': false
  },
  pausada: {
    type: Boolean,
    'default': false
  },
  fechaPausada: {
    type: Date
  }
},{timestamps: true, versionKey: false, collection: 'leccionesRealtime'})

LeccionRealtimeSchema.methods.crearLeccion = function(callback) {
  this.save(callback)
}

LeccionRealtimeSchema.statics.buscarLeccion = function(id_leccion, callback) {
  this.findOne({leccion: id_leccion}, callback)
}

LeccionRealtimeSchema.statics.buscarLeccionPopulate = function(id_leccion, callback) {
  this.findOne({leccion: id_leccion}).populate({path: 'estudiantesDandoLeccion estudiantesDesconectados leccion profesor' }).exec(callback);
}

/* Leccion pausa y continuar*/
LeccionRealtimeSchema.statics.pausar = function(id_leccion, callback) {
  let fecha = moment();
  let current_time_guayaquil = moment(fecha.tz('America/Guayaquil').format())
  this.update({leccion: id_leccion}, {$set: {fechaPausada: current_time_guayaquil, pausada: true}}, callback)
}

LeccionRealtimeSchema.statics.continuar = function(id_leccion, callback) {
  this.update({leccion: id_leccion}, {pausada: false}, callback)
}

/*solo anadir a los estuidantes mientras den la leccion*/
LeccionRealtimeSchema.statics.estudianteConectado = function(id_leccion, id_estudiante, callback) {
  this.update({leccion: id_leccion}, {$addToSet: {estudiantesDandoLeccion: id_estudiante}}, callback)
}

/*anadir cuando un estudiante se salga de la leccion*/
LeccionRealtimeSchema.statics.estudianteDesconectado = function(id_leccion, id_estudiante, callback) {
  this.update({leccion: id_leccion}, {$addToSet: {estudiantesDesconectados: id_estudiante}}, callback)
}

/*cuando un estudiante vuelva ha estar conecatdo nuevamente*/
LeccionRealtimeSchema.statics.estudianteReconectado = function(id_leccion, id_estudiante, callback) {
  this.update({leccion: id_leccion}, {$pull: {estudiantesDesconectados: id_estudiante}}, callback)
}

LeccionRealtimeSchema.statics.corriendoTiempo = function(id_leccion, valor, callback) {
  this.update({leccion: id_leccion}, {corriendoTiempo: valor}, callback)
}

// LeccionRealtimeSchema.statics.anadirProfesor = function(id_leccion, id_profesor, callback) {
//   this.
// }

module.exports = mongoose.model('LeccionRealtime', LeccionRealtimeSchema);
