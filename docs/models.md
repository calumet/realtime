# Data Models

## Persisted

Modelos de datos persistidos en base de datos.

### `user`

| Nombre | Tipo | Descripción |
| :------------- | :------------- | :------------- |
| id | String | Identificador |
| category | String | Referencia a `user_category` |
| firstName | String | Primer nombre |
| lastName | [String] | Primer apellido |
| photo | [String] | URL de fotografía |

### `user_category`

| Nombre | Tipo | Descripción |
| :------------- | :------------- | :------------- |
| id | String | Identificador |
| name | String | Nombre |

### `realtime_space`

| Nombre | Tipo | Descripción |
| :------------- | :------------- | :------------- |
| id | String | Identificador |
| code | String | Código único |
| name | String | Nombre |

### `realtime_space_room`

| Nombre | Tipo | Descripción |
| :------------- | :------------- | :------------- |
| id | String | Identificador |
| space | String | Referencia a `realtime_space` |
| name | String | Nombre |
| tag | [String] | Agrupación por etiqueta |
| createdAt | Date | Fecha de creación |
| disabled | [Boolean] | Sala deshabilitada |

### `realtime_room_user`

| Nombre | Tipo | Descripción |
| :------------- | :------------- | :------------- |
| id | String | Identificador |
| room | String | Referencia a `realtime_space_room` |
| user | String | Referencia a `user` |
| moderator | [Boolean] | Usuario es moderador en sala |
| inactive | [Boolean] | Usuario está inactivo en sala |

### `realtime_room_message`

| Nombre | Tipo | Descripción |
| :------------- | :------------- | :------------- |
| id | String | Identificador |
| room | String | Referencia a `realtime_space_room` |
| user | String | Referencia a `user` |
| content | String | Contenido del mensaje |
| createdAt | Date | Fecha de creación |

## In Memory

Modelos de datos en memoria de aplicación.

### `connection`

| Nombre | Tipo | Descripción |
| :------------- | :------------- | :------------- |
| id | String | Identificador |
| room | String | Referencia a `realtime_space_room` |
| user | String | Referencia a `user` |
| socket | String | Identificador de socket |
| createdAt | Date | Fecha de creación |
