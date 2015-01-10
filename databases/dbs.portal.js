/*!
 * Universidad Industrial de Santander
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Databases | Portal
 * Romel Pérez, prhone.blogspot.com
 * 2015
 **/

var _ = require('underscore');
var rubi = require('../libs/rubi');
var config = require('../config');
var debug = require('debug')('dbs:portal');


// -------------------------------------------------------------------------- //
// PROCEDURES //

/**
 * Referencias a los controladores de las bases de datos utilizadas.
 */
exports.rubi = rubi;


/**
 * Resetear todas las instancias de conexión de usuarios.
 * @param  {Function} callback function(err,result){}
 */
exports.reset = function (callback) {
  rubi.users.update({}, {
    $set: {
      devices: []
    }
  }, {
    multi: true
  }, callback);
};


/**
 * Un usuario se conecta y crea una instancia.
 * @param {Object}   user     {id, ip, time, agent}
 * @param {Object}   socket
 * @param {Function} callback function(err,result){}
 */
exports.addInstance = function (user, socket, callback) {
  rubi.users.findOneAndUpdate({
    _id: user.id
  }, {
    $set: {
      time: new Date(user.time),
      ip: user.ip
    },
    $push: {
      devices: {
        _id: socket,
        agent: user.agent
      }
    }
  }, callback);
};


/**
 * Un usuario cierra una instancia de la aplicación.
 * @param  {Object}   user     {id, ip, time, agent}
 * @param  {Object}   socket
 * @param  {Function} callback function(err,result){}
 */
exports.rmInstance = function (user, socket, callback) {
  rubi.users.findOne({
    _id: user.id
  }, function (err, doc) {
    if (err) {
      callback.apply(this, arguments);
      return;
    }

    // Remover la instancia del socket.
    doc.devices = _.reject(doc.devices, function (el) {
      return socket ===  el._id;
    });

    doc.save(callback);
  });
};


/**
 * Conseguir datos de tiempo real.
 * @param  {Function} callback function(err,results){}
 */
exports.stats = function (callback) {
  rubi.users.count({
    $where: 'this.devices.length > 0'
  }, function (err, count) {
    callback(err, {
      count: count
      //,otras estadísticas (en un futuro): ...
    });
  });
};


/**
 * Agregar mensaje de administración al público.
 * @param  {Object}   options  {startDate,endDate,message,type}
 * @param  {Function} callback function(err,result){}
 */
exports.addMessage = function (options, callback) {
  rubi.messages.create({
    type: options.type,
    publishedBy: options.publishedBy,
    startDate: options.startDate,
    endDate: options.endDate,
    message: options.message
  }, callback);
};


/**
 * Remover mensaje que ha sido publicado en la administración para el público.
 * @param  {String}   id       Identificador del mensaje
 * @param  {Function} callback function(err,result){}
 */
exports.rmMessage = function (id, callback) {
  rubi.messages.findById(id, function (err, msg) {
    if (err) callback.apply(this, arguments);
    else msg.remove(callback);
  });
};
