Realtime (alpha v0.4.3)
=======================

Un sistema de aplicaciones para comunicación en tiempo real para los portales del Grupo de Desarrollo de Software Calumet.

**server** se refiere al servidor de sockets que permitirá crear conexiones en tiempo real con los clientes. Éste funcionará en un puerto distinto al 80. Las pruebas se hacen con el puerto 9000. Éste es el servidor principal.

**client** se refiere al servidor que funcionará en JSP, es decir, es sólo una simulación del servidor real que funcionará en el puerto 80 con JSP. Se hacen pruebas con este servidor creado en nodejs haciendose pasar como un cliente del servidor de sockets. Las pruebas se hacen con el puerto 4000.

**test** son pruebas de componentes y funcionalidades.

Instalación
-----------

Se necesita instalar Node.js y MongoDB. Instrucciones no documentadas.

Para instalar los paquetes de cada servidor (client y server), entra en cada carpeta por terminal y ejecuta el siguiente comando:

```bash
npm install
```

Esto instalará todos los paquetes de nodejs que sean necesarios para el funcionamiento del proyecto.

Notas
-----

Todavía inestable, en etapa de desarrollo. Se prevee una versión minimamente estable en 0.6 y un inicial release en la versión 0.8.
