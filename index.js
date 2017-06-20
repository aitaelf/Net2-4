var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
  var addedUser = false;

  socket.on('new message', function (data) {
	if (socket.username) {
		socket.broadcast.emit('new message', {
		  username: socket.username,
		  message: data
		});
	} else {
		socket.emit('disconnect');
	}
  });

  socket.on('add user', function (username) {
    if (addedUser) return;

    socket.username = username;
    addedUser = true;
	
    socket.emit('login');
    socket.broadcast.emit('user joined', {
      username: socket.username,
    });
	
  });
  
  socket.on('disconnect', function () {
    if (addedUser) {
      socket.broadcast.emit('user left', {
        username: socket.username
      });
    }
	
  });
});