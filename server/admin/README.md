# Configuración de la base de datos rubi

Para el proyecto, se utiliza la versión de **MongoDB 2.6.x**. Los procesos de instalación se encuentran en [http://docs.mongodb.org/manual/installation/](http://docs.mongodb.org/manual/installation/).

Modifica el archivo de configuración adjunto llamado **mongod.conf** con el cual se ejecutará el servidor de base de datos.

## Crear usuario administrador

Coloca `false` en el flag `--auth`del archivo de configuración, el cual desactiva la seguridad del DBMS. Esto sólo en etapa de desarrollo. Luego inicia el servidor utilizando tal configuración.

```bash
$ mongod --config ./mongod.conf
```

Entra a mongo shell, hablandole al servidor en el puerto 2000.

```bash
$ mongo --port 2000
> use admin;
> db.createUser({user: "manager", pwd: "PASSWORD", roles: [{role: "userAdminAnyDatabase", db: "admin"}]});
> db.runCommand({usersInfo: "manager", showPrivileges: true});
```

Con esto ya tenemos al usuario administrador, el cual usamos en etapa de producción.

## Crear usuario programador

Activa el flag `--auth` en el archivo de configuración. Esto es para desarrollo y producción. Luego ejecuta el servidor utilizándolo:

```bash
$ mongod --config ./mongod.conf
```

Entra a mongo shell con el usuario administrador. Se pueden crear más usuarios tanto como en el primer paso como también entrando como usuario administrador.

```bash
$ mongo rubi -u manager -p PASSWORD --port 2000 --authenticationDatabase admin
> db.createUser({user: "programmer", pwd: "PASSWORD", roles: [{ role: "readWrite", db: "rubi" }]});
> db.runCommand({usersInfo: "programmer", showPrivileges: true});
```

Termina el proceso y entra otra vez a mongo shell, pero esta vez con el usuario suministrado para utilizar la base de datos como programador, tanto desde la aplicación como para administrar desde la shell.

```bash
$ mongo rubi -u programmer -p PASSWORD --port 2000 --authenticationDatabase rubi
> show collections;
> db.users.find();
```

## Actualizar datos de rubi con los de diamante

Se necesitan filtrar datos de la base de datos **diamante a la de rubi**. Para hacer esto, simplemente ejecuta la aplicación de node llamada *updaterubi.js*. Recuerda confirmar explicitamente la actualización editando la variable de confirmación en el mismo archivo antes de hacerlo.

```bash
$ node updaterubi.js
```

Ahora ya se puede iniciar el servidor de sockets.
