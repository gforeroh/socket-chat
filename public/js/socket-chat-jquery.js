// funciones para rederizar usuarios
var params = new URLSearchParams(window.location.search);

var nombre = params.get('nombre');
var sala = params.get('sala');

// Referencias de Jquery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMesaje = $('#txtMesaje');
var divChatbox = $('#divChatbox');
var txtSala = $('.txtSala');

txtSala.text(sala);

function renderizarUsuarios(personas) {
    var html = `<li>
                <a href="javascript:void(0)" class="active"> Chat de <span> ${sala}</span></a>
            </li>`;

    for (var i = 0; i < personas.length; i++) {
        html += `<li>
                    <a data-id="${personas[i].id}" href="javascript:void(0)"><img src="assets/images/users/${i+1}.jpg" alt="user-img" class="img-circle"> <span>${personas[i].nombre} <small class="text-success">online</small></span></a>
                </li>`;
    }

    html += `<li class="p-20"></li>`;

    divUsuarios.html(html);
}

function renderizarMensajes(mensaje, yo) {
    var html = ``;
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();

    var adminClass = 'info';
    var noImage = false;
    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger';
        noImage = true;
    }

    if (!yo) {
        html += `<li class="animated fadeIn">
                        <div class="chat-img ${(noImage) ? 'hidde':''}"><img src="assets/images/users/1.jpg" alt="user" /></div>
                        <div class="chat-content">
                            <h5>${mensaje.nombre}</h5>
                            <div class="box bg-light-${adminClass}">${mensaje.mensaje}</div>
                        </div>
                        <div class="chat-time">${hora}</div>
                    </li>`;
    } else {
        html += `<li class="reverse">
                        <div class="chat-content">
                            <h5>${mensaje.nombre}</h5>
                            <div class="box bg-light-inverse">${mensaje.mensaje}</div>
                        </div>
                        <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>
                        <div class="chat-time">${hora}</div>
                    </li>`;
    }



    divChatbox.append(html);
}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

// Escuchas jQuery
divUsuarios.on('click', 'a', function() {
    var id = $(this).data('id');

    if (id) {
        console.log(id);

    }
});

formEnviar.on('submit', function(e) {
    e.preventDefault();

    if (txtMesaje.val().trim().length === 0) {
        txtMesaje.val('').focus();
        return;
    }

    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMesaje.val()
    }, function(mensaje) {
        txtMesaje.val('').focus();
        renderizarMensajes(mensaje, true);
        scrollBottom();
    });
});