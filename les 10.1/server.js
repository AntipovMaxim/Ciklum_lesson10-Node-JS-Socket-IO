var app = require('http').createServer(handler).listen(3000);
var io = require('socket.io')(app);
var fs = require('fs');



function handler (req, res) {
 if (req.url === '/login'){
         	fs.createReadStream(__dirname + '/client/login/login.html', 'utf8').pipe(res);
         }


if (req.url === '/chat'){
         	fs.createReadStream(__dirname + '/client/chat/chat.html', 'utf8').pipe(res);
         }


if (req.url === '/'){
         	res.writeHead(302, {'Location': '/login'});

		res.end();
         }


}


var users = [];
var messages = [];


var login = io.of('/login').on('connection', function(socket){
 
	socket.on('login', function(log){
	   
	   if(users.length < 5){
	   	    users.push({name: log, id: null});
	        login.emit('in')
	  
	   }else{
	   	  login.emit('out')
	   }

	  });
});

var chat = io.of('/chat')
.on('connection', function (socket) {

     socket.emit('firstLoad', {messages: messages, users: users}); //FIRST LOAD EVENT
     
     chat.emit('addUserBox', users);

	var name;
	if (users.length !== 0) {

  		users[users.length - 1].id = socket.id;

  	}

    var d = new Date();
  	var time = `${d.toTimeString().split(' ')[0]}`;

  	users.forEach( function(element) {
       	   if(element.id == socket.id){
       	   	 name = element.name;
             socket.broadcast.emit('addUser', {name: name, time: time}); // EVERYONE EXCEPT CURRENT. MESSAGE THAT USER CONNECTED

       	   }

       	})


// LISTENING MESSAGE EVENT
	socket.on('message', function (message) { 
       var d = new Date();
  	   var time = `${d.toTimeString().split(' ')[0]}`;
       users.forEach( function(element) {
       	   if(element.id == socket.id){
       	   	 name = element.name;
       	   }

       });

       var fullMessage = {name: name, time: time, message: message};

       messages.push(fullMessage);

        socket.emit('current', {message: message, time: time}); //CURRENT USER EVENT MESSAGE
		    socket.broadcast.emit('message', fullMessage);  // EVERYONE EXCEPT CURRENT
	})

//DISCONNECT EVENT
	socket.on('disconnect', function () {
		    var d = new Date();
  	    var time = `${d.toTimeString().split(' ')[0]}`;
    		
        users.forEach( function(element, index) {
    			if(element.id === socket.id){
                    users.splice(index, 1);
                    chat.emit('userDisconnect', {users: users, user: element.name, time: time});

    			}

    		});


	})
})









