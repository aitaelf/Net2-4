var username;
var connected = false;

var socket = io();

function auth() {
	username = $('.usernameInput').val();
	socket.emit('add user', username);
	$('.auth').attr('style', 'display: none');
	$('.chatArea').attr('style', 'display: block');
}

// Sends a chat message
function sendMessage() {
	var message = $('.inputMessage').val();

	if (connected) {
		$('.inputMessage').val('');
		socket.emit('new message', message);
		log(message, username);
	}
}

function log (message, username) {
	if (connected) {
		username = username || 'system message';
		var $el = $('<li>').addClass('log').text(username + ": " + message);
		$('.messages').append($el);
	}
}


socket.on('login', function (data) {
	connected = true;
	var message = "Welcome to Socket.IO Chat :)";
	log(message);
});

socket.on('new message', function (data) {
	log(data.message, data.username);
});

socket.on('user joined', function (data) {
	log(data.username + ' joined');
});

socket.on('disconnect', function () {
	connected = false;
    log('you have been disconnected');
	window.location.reload();
  });