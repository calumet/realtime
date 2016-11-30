function sockets (io) {

  io.on('connection', socket => {

    console.log(`${socket.id} connect`);

    socket.on('message', (data) => {
      const parsed = JSON.stringify(data);
      console.log(`${socket.id} message ${parsed}`);
    });

    socket.on('disconnect', () => {
      console.log(`${socket.id} disconnect`);
    });

  });

}

module.exports = sockets;
