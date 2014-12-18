// Realtime
// Resetear datos de la base de datos "diamante" a "rubi"

var RESET = false;  // SEGURIDAD OBVIA PARA EVITAR EQUIVOCACIONES

var rubi = require('../libs/rubi');
var diamante = require('../libs/diamante');

var isNumber = function (e){return!isNaN(parseFloat(e))&&isFinite(e);};


// Administrador de procesos de re-seteo de datos
var Processes = {

    order: ['users', 'aula'],
    completados: 0,
    completar: 2,
    ctx: null,

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
            console.log('Re-seteo finalizado correctamente.');
            diamante.disconnect();
            rubi.disconnect();
        } else {
            this.next();
        }
    },

    // ---------------------------------------------------------------------- //
    // DATOS DE USUARIOS //
    users: function () {

        var diamanteConn = this.ctx.diamanteConn;
        var users = this.ctx.users;

        diamanteConn.query('SELECT IdUsr,IdPerfil,LoginUsr,CodProf,CodPos,CodEst,Estado'
        + ',PrimNomUsr,PrimApeUsr,Foto FROM TP_Usuarios;', function (err, usersList, fields) {
            if (err) throw err;

            // IMPORTANT: No se tiene en cuenta la verificación de si el IdPerfil
            // está activo o no en la tabla diamante.TB_Perfiles.

            // Remover datos actuales
            users.remove({}, function (err, res) {
                if (err) throw err;
                process.stdout.write('.');
            });

            // Migrar datos
            for (var user, ct = 0, i = 0; i < usersList.length; i += 1) {
                user = usersList[i];
                users.create({
                    _id: user.IdUsr,
                    codEst: (isNumber(user.CodEst) ? user.CodEst : 0),
                    codPos: (isNumber(user.CodPos) ? user.CodPos : 0),
                    codProf: (isNumber(user.CodProf) ? user.CodProf : 0),
                    active: (user.Estado === 'Activo' || user.Estado === 'Manual' ? true : false),
                    admin: (user.IdPerfil === 'PE1' || user.IdPerfil === 'PE17' ? true : false),
                    name: user.PrimNomUsr + ' ' + user.PrimApeUsr,
                    photo: user.Foto,
                    ip: null,
                    time: null,
                    devices: []
                }, function (err, doc) {
                    if (err) throw err;
                    process.stdout.write('.');
                    ct++;
                    if (ct === usersList.length) {
                        Processes.done();
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


// Sólo actualizar si se está consciente de ello
if (RESET) {

    console.log('Migrando datos de usuarios de "diamante" a "rubi".');
    console.log('Iniciando procesos...');

    // Iniciar una vez se haya conectado con las bases de datos
    rubi.connect(function () {
        diamante.connect(function () {
            Processes.ctx = {
                diamanteConn: diamante.connection,
                users: rubi.users
            };
            Processes.start();
        });
    });
} else {
    console.log('Esta acción no está definida por realizarse en el script.'
    + ' Modifica el archivo del script.');
};
