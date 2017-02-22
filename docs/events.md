# Socket Events

Además de los eventos que provee [socket.io](http://socket.io), se tienen:

## Listeners

Eventos que se escuchan en el servidor y sus datos recibidos de socket.

### `room:message`

Se recibe un mensaje de un usuario para una sala específica.

```json
{
  "room": String,
  "content": String
}
```

## Emitters

Eventos emitidos a los socket cliente y los datos enviados.

### `room:user:connect`

Se envía el estado de conexión de otro usuario al usuario del socket.

*Item del modelo `connection`.*

### `room:user:disconnect`

Se envía el estado de desconexión de otro usuario al usuario del socket.

*Item del modelo `connection`.*

### `room:message`

Se envía un mensaje de sala de otro usuario al usuario del socket.

*Item de modelo `realtime_room_message`.*
