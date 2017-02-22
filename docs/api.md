# HTTP API

HTTP endpoints.

## `GET /api/users`

Devuelve colección de todos los usuarios.

## `GET /api/users/:id`

Devuelve objeto de usuario por identificador.

## `GET /api/users-categories`

Devuelve colección de categorías de usuarios.

## `GET /api/users-categories/:id`

Devuelve objeto de categoría de usuarios por identificador.

## `GET /api/realtime`

Devuelve un snapshot del estado actual de conexión de un usuario en un espacio.

Request query:

`{`

- `spaceCode` - Código de espacio
- `userId` - Identificador de usuario
- `roomTag` - Etiqueta de salas a conectarse, opcional

`}`

Response body:

`{`

- `space`: Objeto de `realtime_space`,
- `rooms`: Colección de `realtime_space_room`,
- `roomsMessages`: Colección de `realtime_room_message`,
- `roomsUsers`: Colección de `realtime_room_user`,
- `connections`: Colección de `connection`,
- `users`: Colección de `user`

`}`

## `GET /api/realtime-spaces`

Devuelve una colección de espacios.

## `GET /api/realtime-spaces/:id`

Devuelve un objeto de espacio por identificador.
