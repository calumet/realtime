# RealTime

RealTime es un servidor web real-time basado en [node.js](http://nodejs.org),
[express.js](http://expressjs.com), [socket.io](http://socket.io)
y [waterline](https://github.com/balderdashy/waterline) para integrar con una plataforma de usuarios. La plataforma de usuarios para el Grupo Calumet sería el proyecto COMA.

Se organizan las aplicaciones por "espacios", en las cuales los usuarios pueden conectarse a través de "salas". La plataforma de usuarios se debe encargar de administrar estos datos, y este servidor se encarga de las tareas de comunicación en tiempo real.

La conexión desde el cliente con este servidor se analiza en [realtime-client](https://github.com/calumet/realtime-client).

Toda la parte de conexión con base de datos se analiza en [realtime-data-public](https://github.com/calumet/realtime-data-public).

Para lo que concierne este servidor:

- [Installation](./install.md)
- [Security](./security.md)
- [Data Models](./models.md)
- [Socket Events](./events.md)
- [HTTP API](./api.md)
