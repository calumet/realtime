# Security

Las comunicaciones suceden entre cliente **realtime-client** y el servidor **realtime**.
Debido a que la comunicación inicia desde el cliente, ahí se define la autentificación
y la autorización para la comunicación. Esto se hace por medio de unas variables, entre
ellas, un token.

```js
realtime.start({
  server: 'http://127.0.0.1:9700',
  spaceCode: 'aulavirtual',
  userId: 'U123456',
  token: 'e94c14e343e51a4b29404fd16c65fe18',
});
```

Usando estas variables, al establecer la conexión se hacen unos procedimientos
para verificar que la conexión es segura.

El token es generado usando una llave privada compartida y comunicándola en el
intercambio de datos.

```js
const signature = 'aQ%^GJH@s_*&AEm64a2KHQ6?H4$j2x%FKnWp^5SJ&=ZG%^mWL#^FJ!_xZ#Ck_s7JxqDdLhP^hWS6DDGvNvJ=h9&+eH!zR6aXCS+SUkM=EzxZ%NzhhF-@?CwQ4xmd5cv_';
const userId = 'U123456';
const token = md5(`realtime-${signature}-${userId}`);
// 'e94c14e343e51a4b29404fd16c65fe18'
```
