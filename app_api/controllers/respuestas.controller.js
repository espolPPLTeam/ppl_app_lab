const RespuestaModel = require('../models/respuestas.model');
var response = require('../utils/responses');

const crearRespuesta = (req, res) => {
	let resp = new RespuestaModel({
		estudiante: req.body.estudiante,
		leccion: req.body.leccion,
		pregunta: req.body.pregunta,
		paralelo: req.body.paralelo,
		grupo: req.body.grupo,
		contestado: req.body.contestado,
		respuesta: req.body.respuesta,
		//fechaEmpezado: req.body.fechaEmpezado,
		//fechaTerminado: req.body.fechaTerminado,
		calificacion: 0,
		feedback: ''
	});
	console.log(resp)
	resp.crearRespuesta((err) => {
		if(err) return response.serverError(res);
		return response.creado(res, resp);
	});
}

const obtenerRespuestasPorGrupoAPregunta = (req, res) => {
	RespuestaModel.obtenerRespuestasPorGrupoAPregunta(req.body.leccion, req.body.pregunta, req.body.grupo, (err, respuesta) => {
		if(err) return response.serverError(res);
		return response.ok(res, respuesta);
	})
}

const obtenerRespuestaDeEstudiante = (req, res) => {
	RespuestaModel.obtenerRespuestaDeEstudiante(req.params.id_leccion, req.params.id_pregunta, req.params.id_estudiante, (err, doc) => {
		if(err) return response.serverError(res);
		return response.ok(res, doc);
	})
}

const actualizarRespuesta = (req, res) => {
	RespuestaModel.actualizarRespuesta(req.params.id_respuesta, req.body.respuesta, (err, doc) => {
		if (!doc.nModified) return response.mongoError(res, 'La respuesta no existe');
		if(err) return response.serverError(res);
		return response.okActualizado(res);
	});
}

module.exports = {
	crearRespuesta,
	obtenerRespuestasPorGrupoAPregunta,
	obtenerRespuestaDeEstudiante,
	actualizarRespuesta
}
