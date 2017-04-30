const mongoose = require('mongoose');
const dbURL = require('../config/main');
const URL_LOCAL = require('../config/main').local
const URL_MLAB = require('../config/main').mlab
mongoose.connect(URL_LOCAL)
const db = mongoose.connection;

db.on('error', function(err) {
  console.log(`error ${err}`);
})

db.on('connected', function() {
  console.log(`base de datos conectada`);
})

var co = require('co')

module.exports = {
  init: function() {
    var paralelos = require('./paralelos.ws.init')
    var estudiantes = require('./estudiantes.ws.init')
    var profesores = require('./profesores.ws.init')
    co(function* () {
      var p = yield paralelos()
      var e = yield estudiantes()
      var pro = yield profesores()
      mongoose.connection.close()
    }).catch(fail => {
      console.log(fail);
    })
  },
  paralelos_nuevo_semestre() {

  },
  upload: function() {
    require('./profesores.ws.update')
    require('./estudiantes.ws.update')
  }
}
