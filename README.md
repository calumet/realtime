# RealTime (alpha v0.4)

Un sistema de aplicaciones para comunicación en tiempo real para los portales del Grupo de Desarrollo de Software Calumet.

**server** servidor de Node.js que permitirá crear conexiones en tiempo real con los clientes mediante sockets. Puerto distinto al 80. Pruebas en el puerto *7000*.

**client** servidor simulando ser el de JSP que funciona en el puerto 80. Se hacen pruebas con este servidor creado en Node.js haciendose pasar como un cliente del servidor de Node.js. Las pruebas se hacen con el puerto *7200*.

**tests** pruebas de desarrollo y testeo.

## Instalación y configuración

> Esto funcionará en una computadora que tenga ya previamente instalado y configurado todo lo necesario del portal web de Calumet (proyecto privado).

Para instalar el servidor de sockets se necesita instalar Node.js 0.10.x y MongoDB 2.6.x. Las instrucciones de instalación no están documentadas.

Sigue las instrucciones de configuración de MongoDB que se encuentran en [/server/admin/](https://github.com/calumet/realtime/tree/master/server/admin).

Node.js no es necesario configurarlo, sólo se necesitan instalar los paquetes de cada servidor (client y server). Entra en cada carpeta por terminal y ejecuta el siguiente comando:

```bash
$ npm install
```

Esto instalará todos los paquetes de node que sean necesarios para el funcionamiento del proyecto.

## Ejecución

Primero, inicia el servidor de MongoDB con la configuración hecha:

```bash
$ mongod --config ./mongod.conf
```

Luego, activando los mensajes de *debug* de la funcionalidad del proyecto, el servidor de sockets en la carpeta *server*:

```bash
$ DEBUG=server,sockets,socket:*,routes,routes:*,dbs,dbs:* node server.js
```

Una vez iniciados, ya se pueden crear conexiones con el servidor de sockets. Se hacen pruebas con el servidor *client*.

## Notas

Todavía inestable, en etapa de desarrollo. Se prevee una versión minimamente estable en 0.6 y un inicial release en la versión 0.8.

## Licencia

MIT
