var express  = require('express');
var app = express();
var http = require('http').Server(app);
var io   = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var usernames = {};

var numUsers = 0;

io.on('connection', function (socket) { 

  // when the client emits 'sendchat', this listens and executes
  socket.on('sendchat', function (data) {
    socket.emit('updatechat', socket.username, data, true); // show to person who typed
    socket.broadcast.emit('updatechat', socket.username, data, false); // show to other
  });

  // when the client emits 'adduser', this listens and executes
  socket.on('adduser', function(username){
    socket.username = username;
    usernames[username] = username;
    numUsers += 1;
    io.emit('updateusers', numUsers);
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function(){
    delete usernames[socket.username];
    numUsers -= 1;
    io.emit('updateusers', numUsers);
  });
});


http.listen(5000, function() {
  console.log('listening to port 5000'); 
});
