const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

const usuarios = new Usuarios();


io.on('connection', (client) => {
    // console.log('Usuario conectado');

    client.on('entrarChat', (data, callback) => {
        // console.log(data);

        if (!data.nombre || !data.sala) {
            return callback({
                err: true,
                mensaje: "El nombre y la sala son necesarios."
            });
        }

        client.join(data.sala);

        usuarios.agregarPersonas(client.id, data.nombre, data.sala);

        client.broadcast.to(data.sala).emit('listaPersonas', usuarios.getPersonasPorSala(data.sala));
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${data.nombre} se unió al chat.`))


        callback(usuarios.getPersonasPorSala(data.sala));
    });

    client.on('crearMensaje', (data, callback) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        callback(mensaje);
    });

    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);
        // console.log("personaBorrada", personaBorrada);

        if (personaBorrada) {
            client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} abandonó el chat.`))
            client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala));
        }
    });

    client.on('mensajePrivado', data => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(data.para).emit('mensajePrivado', mensaje);
    });

});