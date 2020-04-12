var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y las sala son necesarios.')
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};

$('.usuario').text(usuario.nombre);
$('.sala').text(usuario.sala);


socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrarChat', usuario, function(resp) {
        console.log("Usuarios conectados:", resp);

    })
});

socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});


// Emit Enviar informacion
// socket.emit('crearMensaje', {
//     usuario: 'Gerardo Forero',
//     message: "Hola Mundo"
// }, function(resp) {
//     // console.log("se disparó el callback");
//     console.log('Respuesta Server:', resp);
// });

// on Escuchar información
socket.on('crearMensaje', function(resp) {
    console.log("Servidor", resp);
});

// Escuchar cambios de usuarios
socket.on('listaPersonas', function(personas) {
    console.log(personas)
});

// mensajes privados
socket.on('mensajePrivado', function(mensaje) {
    console.log('Mensaje privado', mensaje);
})