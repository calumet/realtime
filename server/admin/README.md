# Configuración de la base de datos rubi

Para el proyecto, se utiliza la versión de **MongoDB 2.6.x**. Los procesos de instalación se encuentran en [http://docs.mongodb.org/manual/installation/](http://docs.mongodb.org/manual/installation/).

El archivo de configuración de ejemplo adjunto llamado **mongod.conf** se debe escribir en el archivo `/etc/mongod.conf`. Luego de eso, reiniciar el servidor:

```bash
$ service mongod restart
```

Si se desea crear una instancia diferente para el DBMS, se utiliza:

```bash
$ cd /home/romel/projects/work/realtime/server/admin/
$ mongod --config ./mongod.conf
```

## Crear usuario administrador

Coloca `false` en el flag `--auth`del archivo de configuración, el cual desactiva la seguridad del DBMS. Esto sólo en etapa de desarrollo. Reinicia el servidor.

Luego, entra a mongo shell hablandole al servidor en el puerto 2000:

```bash
$ mongo --port 2000
> use admin;
> db.createUser({user: "manager", pwd: "PASSWORD", roles: [{role: "userAdminAnyDatabase", db: "admin"}]});
> db.runCommand({usersInfo: "manager", showPrivileges: true});
```

Con esto ya tenemos al usuario administrador, el cual usamos en etapa de producción.

## Crear usuario programador

Activa el flag `--auth` en el archivo de configuración. Esto es para desarrollo y producción. Luego reinicia el servidor.

Entra a mongo shell con el usuario administrador. Se pueden crear más usuarios en esta y en la anterior forma.

```bash
$ mongo rubi -u manager -p PASSWORD --port 2000 --authenticationDatabase admin
> use rubi;
> db.createUser({user: "programmer", pwd: "PASSWORD", roles: [{ role: "readWrite", db: "rubi" }]});
> db.runCommand({usersInfo: "programmer", showPrivileges: true});
```

Termina el proceso y entra otra vez a mongo shell, pero esta vez con el usuario suministrado para utilizar la base de datos como programador, tanto desde la aplicación como para administrar desde la shell.

```bash
$ mongo rubi -u programmer -p PASSWORD --port 2000 --authenticationDatabase admin
> show collections;
> db.users.find();
```

## Resetear datos de diamante a rubi

Se necesitan definir/redefinir datos de la base de datos **diamante a la de rubi**. Para hacer esto, simplemente ejecuta la aplicación de node llamada *reset.js*. Recuerda confirmar explicitamente la actualización editando la variable de confirmación al principio del mismo archivo antes de hacerlo.

```bash
$ node reset.js
```

Ahora ya se puede iniciar el servidor de sockets.

## Actualizar datos de diamante a rubi

Periódicamente se necesitan sincronizar datos de diamante a rubi. Esto buscara cambios en datos de usuarios, clases, etc. Para ello:

```bash
$ node sync.js
```

También se puede programar un **crontab** para que ejecute el mismo comando cada cierto tiempo en **/etc/crontab**:

```bash
0 3 * * * root node /home/romel/projects/work/realtime/server/admin/sync.js
```

Esto sincronizará datos a las 3 AM todos los días.

## Hacer backup y restaurar a rubi

### Backup

Podrás encontrar la documentación en [http://docs.mongodb.org/manual/tutorial/backup-with-mongodump/](http://docs.mongodb.org/manual/tutorial/backup-with-mongodump/). Mientras el servidor esté corriendo, para hacer un backup de la base de datos rubi, se utiliza el siguiente comando:

```bash
$ mongodump --port 2000 --db rubi -u programmer -p PASSWORD --out /home/romel/Downloads/
```

Teniendo en cuenta la configuración y cambiar la carpeta de destino con el flag `--out`. Si no está corriendo el servidor, se debe agregar el flag `--dbpath` con la ubicación física de la base de datos.

### Restaurar

Para restaurar un backup se utiliza el siguiente comando:

```bash
$ mongorestore --port 2000 --db rubi -u programmer -p PASSWORD /home/romel/Downloads/rubi
```

En donde el último argumento, es la carpeta donde se encuentra el backup.
