const _ = require('lodash');
const uuid = require('uuid/v4');

class Connections {

  constructor () {

    /**
     * Estructura de datos de conexiones por sockets de un usuario en
     * diferentes salas.
     * @example
     * [{
     *   id: String,
     *   room: String,
     *   user: String,
     *   socket: String,
     *   createdAt: Number,
     * }]
     * @type {Array}
     */
    this._list = [];
  }

  get (id) {
    if (!id) return;
    const list = this._list;
    const item = _(list).find(i => i.id === id);
    if (item) return Object.assign({}, item);
  }

  getAll () {
    return this._list.map(i => Object.assign({}, i));
  }

  getBySocket (socket) {
    if (!socket) return [];
    return this._list.
      filter(i => i.socket === socket).
      map(i => Object.assign({}, i));
  }

  getByRoom (room) {
    if (!room) return [];
    return this._list.
      filter(i => i.room === room).
      map(i => Object.assign({}, i));
  }

  getByUser (user) {
    if (!user) return [];
    return this._list.
      filter(i => i.user === user).
      map(i => Object.assign({}, i));
  }

  add ({ room, user, socket }) {

    if (!room) throw new Error('Room id is required');
    if (!user) throw new Error('User id is required');
    if (!socket) throw new Error('Socket id is required');

    const item = {
      id: uuid(),
      createdAt: Date.now(),
      room,
      user,
      socket,
    };
    this._list.push(item);

    return Object.assign({}, item);
  }

  remove (id) {
    if (!id) return;
    this._list = this._list.filter(i => i.id !== id);
  }

  removeBySocket (socket) {
    if (!socket) return;
    this._list = this._list.filter(i => i.socket !== socket);
  }

}

module.exports = Connections;
