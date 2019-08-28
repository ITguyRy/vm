'use strict';

var isInitiator;
var socket = io.connect('http://localhost:8080');
//window.room = prompt("Enter room name:");
var room = window.location.hash.substring(1);
if (!room) {
  room = window.location.hash = randomToken();
}
if (room){
  var room_url = window.location.href;
  socket.emit('room', room);
  console.log(room_url);
  socket.emit('room_url', room_url);
}




var message = document.getElementById('message'),
      handle = document.getElementById('handle'),
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      feedback = document.getElementById('feedback');

if(btn){
  btn.addEventListener('click', function(){
      socket.emit('chat', {
          message: message.value,
          handle: handle.value
      });
      message.value = "";
  });
}

if(message){
  message.addEventListener('keypress', function(){
      socket.emit('typing', handle.value);
  })
}
socket.emit('chat message', 'hello');
// Listen for events
socket.on('chat', function(data){
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
});

socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});




if (room !== "") {
  console.log('Message from client: Asking to join room ' + room);
  socket.emit('create or join', room);
}

socket.on('created', function(room, clientId) {
  isInitiator = true;
});

socket.on('full', function(room) {
  console.log('Message from client: Room ' + room + ' is full :^(');
  console.log('Room ' + room + ' is full. We will create a new room for you.');
  window.location.hash = '';
  window.location.reload();
  console.log('new room: ' + room)
});

socket.on('ipaddr', function(ipaddr) {
  console.log('Message from client: Server IP address is ' + ipaddr);
});

socket.on('joined', function(room, clientId) {
  isInitiator = false;
});

socket.on('log', function(array) {
  console.log.apply(console, array);
});

function randomToken() {
  return Math.floor((1 + Math.random()) * 1e16).toString(16).substring(1);
}
