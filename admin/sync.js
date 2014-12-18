// Realtime
// Proceso de sincronización de datos de "diamante" a "rubi".

var rubi = require('../libs/rubi');
var diamante = require('../libs/diamante');


// Administrador de procesos de sincronización de datos
var Processes = {

    order: ['users', 'aula'],
    completados: 0,
    completar: 2,

    // Iniciar el primer proceso
    start: function () {
        this.next();
    },

    // Continuar el siguiente proceso
    next: function () {
        var component = this.order[this.completados];
        console.log('> Proceso "'+ component +'" iniciado...');
        this[this.order[this.completados]]();
    },

    // Complicar el proceso actual y vericicar si es el final
    done: function () {
        var component = this.order[this.completados];
        this.completados++;
        console.log('\nProceso "'+ component +'" completado ('+ this.completados
        +'/'+ this.completar +').');
        if (this.completados / this.completar === 1) {
            console.log('Sincronización finalizada correctamente.');
            diamante.disconnect();
            rubi.disconnect();
        } else {
            this.next();
        }
    },

    // ---------------------------------------------------------------------- //
    // DATOS DE USUARIOS //
    users: function () {

        var diamanteConn = diamante.connection;
        var users = rubi.users;

        diamanteConn.query('SELECT IdUsr,IdPerfil,LoginUsr,CodProf,CodPos,CodEst,Estado'
        + ',PrimNomUsr,PrimApeUsr,Foto FROM TP_Usuarios;', function (err, usersList, fields) {
            if (err) throw err;

            // IMPORTANT: No se tiene en cuenta la verificación de si el IdPerfil
            // está activo o no en la tabla diamante.TB_Perfiles.

            // Migrar datos
            for (var user, ct = 0, i = 0; i < usersList.length; i += 1) {

                user = usersList[i];
                users.update({
                    _id: user.IdUsr
                }, {
                    active: (user.Estado === 'Activo' || user.Estado === 'Manual' ? true : false),
                    admin: (user.IdPerfil === 'PE1' || user.IdPerfil === 'PE17' ? true : false),
                    name: user.PrimNomUsr + ' ' + user.PrimApeUsr,
                    photo: user.Foto
                }, function (err, affected) {
                    if (err) throw err;
                    if (affected === 1) {
                        process.stdout.write('.');
                        ct++;
                        if (ct === usersList.length) {
                            Processes.done();
                        }
                    } else {
                        throw new Error('Error procesando: '+ user.IdUsr);
                    }
                });
            }
        });
    },

    // ---------------------------------------------------------------------- //
    // DATOS DE AULA //
    aula: function () {

        // TODO: Migrar datos del aula desde diamante a rubi.

        // Lo siguiente es un "dummy".
        for (var i = 0; i < 1000; i += 1) {process.stdout.write('.');}
        Processes.done();
    }

};

console.log('Sincronización de datos de "diamante" a "rubi"...');
console.log('Iniciando procesos...');

// Iniciar una vez se haya conectado con las bases de datos
rubi.connect(function () {
    diamante.connect(function () {
        Processes.start();
    });
});
