# RealTime (alpha v0.4)

> Todavía inestable, en etapa de desarrollo. Se prevee una versión minimamente estable en 0.6 y un inicial lanzamiento en la versión 0.8.

Un sistema de aplicaciones para comunicación en tiempo real para los portales del Grupo de Desarrollo de Software Calumet.

Éste es el ervidor de Node.js que permitirá crear conexiones en tiempo real con los clientes mediante sockets. Puerto distinto al 80. Pruebas en el puerto *7000*.

En **tests** se encuentran pruebas de desarrollo, testeo y snippets.

## Instalación y configuración

> Esto funcionará en una computadora que tenga ya previamente instalado y configurado todo lo necesario del portal web de Calumet (proyecto privado).

Para instalar el servidor de sockets se necesita instalar **Node.js 0.10.x** y **MongoDB 2.6.x**. Las instrucciones de instalación no están documentadas.

Sigue las instrucciones de configuración de MongoDB que se encuentran en [/admin/](https://github.com/calumet/realtime/tree/master/admin).

Node.js no es necesario configurarlo, sólo se necesitan instalar los paquetes necesarios para el servidor.

```bash
$ npm install
```

Esto instalará todos los paquetes de node.js que sean necesarios para el funcionamiento del proyecto.

## Ejecución

Se debe asegurar de que el servidor de MongoDB esté ejecutándose con la configuración para el proyecto. La información de encuentra en *admin*.

Luego, corriendo el servidor de node.js:

```bash
$ DEBUG=server,sockets,socket:*,routes,routes:*,dbs,dbs:*,libs:* node server.js
```

En modo desarrollo con los mensajes de *debug* de las funcionalidades del proyecto:

```bash
$ node server.js
```

Una vez iniciados, ya se pueden crear conexiones con este servidor de sockets. Se hacen pruebas con el servidor **[realtime-client](https://github.com/calumet/realtime-client)**.

## Licencia

The MIT License (MIT)

Copyright (c) 2014 Calumet

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
