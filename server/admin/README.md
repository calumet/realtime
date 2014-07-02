# Administración de la base de datos 'rubi'

Para el proyecto, se utiliza la versión de **MongoDB 2.6.x**. Los procesos de instalación se encuentran en [http://docs.mongodb.org/manual/installation/](http://docs.mongodb.org/manual/installation/).

## Crear usuario administrador

Correr servidor sin el flag `--auth`. Esto sólo en etapa de desarrollo.

```bash
$ sudo mongod --config ./mongod.conf
```

Entrar a mongo shell, hablandole al servidor en el puerto 2000.

```bash
$ mongo --port 2000
> use admin;
> db.createUser({user: "manager", pwd: "admin", roles: [{role: "userAdminAnyDatabase", db: "admin"}]});
> db.runCommand({usersInfo: "manager", showPrivileges: true});
```

## Crear usuario programador

Correr el servidor con `--auth` ya activado. Esto es para desarrollo y producción.

```bash
$ mongod --config ./mongod.conf
```

Entrar a mongo shell como administrador. Se pueden crear más usuarios tanto como en el primer paso como también entrando como usuario administrador.

```bash
$ mongo rubi -u manager -p admin --port 2000 --authenticationDatabase admin
> db.createUser({user: "programmer", pwd: "admin", roles: [{ role: "readWrite", db: "rubi" }]});
> db.runCommand({usersInfo: "programmer", showPrivileges: true});
```

Entrar a mongo shell, pero esta vez con el usuario suministrado para utilizar la base de datos como programador, tanto desde la aplicación como para administrar desde la shell.

```bash
$ mongo rubi -u programmer -p admin --port 2000 --authenticationDatabase rubi
> show collections;
> db.users.find();
```
