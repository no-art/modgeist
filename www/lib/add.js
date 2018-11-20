 //init
var pop=false;//pour popup
var noSleep = new NoSleep();
var wakeLockEnabled = false;
var delivery;
var roomInt=-1;
var pubnub;
var p_uuid;
var socket;
var streamOk=false;
var _room='init';
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
var r_uuid=guid();
socket = RealtimeMessaging.createClient();
	socket.setId(r_uuid)
	socket.setConnectionMetadata(r_uuid)
	socket.setClusterUrl('https://ortc-developers.realtime.co/server/ssl/2.1/');


	socket.connect('HV1kA2', 'slave');
	socket.onConnected = function (o) {
		socket.send('send_master',JSON.stringify({room : 'connect',msg :{i :'pong',ii :'none'}, uuid:r_uuid}));
		console.log(socket.getId())
 // 	console.log("Connected to " + socket.getUrl());
 	socket.subscribe('public_chat',true,function(o,c,m){
 		console.log(JSON.parse(m))
 		 $('#messages').prepend($('<li>').text(JSON.parse(m).text));
 	})
  	socket.subscribe('receive_master', true, function (o, c, m) {
  		var mes=JSON.parse(m);
  		if(mes.message) updateWidget(mes.message)
  		else if (mes.ping) {socket.send('send_master',JSON.stringify({room : _room,msg :{i :'pong'}, uuid:r_uuid}));
  			if(streamOk==true)pubnubEmit("stream","ready");
  		}
  		else return;
 	 });
  	 socket.subscribe('r_uuid', true, function (o, c, m) {
  		var mes=JSON.parse(m);
  		updateWidget(mes.message)
 	 });

};





function pubnubEmit(r,m){	
		  	socket.send('send_master',JSON.stringify({room : _room,msg :{i :r,ii :m}, uuid:r_uuid}));
}
function chat(m){

	 		socket.send('public_chat',JSON.stringify(m))
}

function updateWidget(w) {
	//console.log(w);
	var val = "";
	for(var i = 0; i < w.length; i++) {	
		if(typeof w[i]=== 'string'){
			w[i]=w[i].replace(/_/gi,',');
			w[i]=w[i].replace(/#/gi,' ');
			val+=w[i];
		}
 		else{			 
 			val+=w[i];
 			val+=' ';
		}
	}
	try{eval(val);}
	catch(err) {;}
}	
function startMessage(){
	;
}
	
///////////////////chat 
function none(){
;}
function envoiMessage(mess) {
  var message = {
        text : $('#chat-msg').val()
    }
  console.log(message);
    if (message.text.trim().length !== 0) { // Gestion message vide
     // pubnubEmit('chat-message', message);
     	chat(message)
     	$('#chat-msg').val(''); // On vide le champ texte
    }
  }
	function like(){
		getId("audioLike").play();
		//pubnubEmit('nx',"like");
		}	
/*
//////////////////////////////////////////////////////////////
WebSocket  = PUBNUB.ws;
var send_socket = new WebSocket('wss://pubsub.pubnub.com/pub-c-852a5c46-7fb4-4992-a368-7c7d95623c9b/sub-c-0b11be12-e764-11e8-91a4-7e00ddddd7aa/send_master')
var receive_socket = new WebSocket('wss://pubsub.pubnub.com/pub-c-852a5c46-7fb4-4992-a368-7c7d95623c9b/sub-c-0b11be12-e764-11e8-91a4-7e00ddddd7aa/receive_master')
var chat_socket = new WebSocket('wss://pubsub.pubnub.com/pub-c-852a5c46-7fb4-4992-a368-7c7d95623c9b/sub-c-0b11be12-e764-11e8-91a4-7e00ddddd7aa/public_chat')
chat_socket.onmessage = function(m) {
	//  console.log('socket receive');
        console.log( JSON.stringify(m));
        $('#messages').prepend($('<li>').text(m.data.text));
    }
 receive_socket.onmessage = function(m) {
 		console.log(JSON.stringify(m))
        updateWidget(m.data);
    }
function pubnubEmit(r,m){
	
		  	send_socket.send({room : r,msg :m});
}
function chat(m){
		chat_socket.send(m);
}


/////////////////////////////////////////////////
function publish(){
	    pubnub = new PubNub({
	    	windowing     : 1,
	        publishKey : 'pub-c-852a5c46-7fb4-4992-a368-7c7d95623c9b',
	        subscribeKey : 'sub-c-0b11be12-e764-11e8-91a4-7e00ddddd7aa',
	        ssl:true
    });
	    p_uuid=PubNub.generateUUID();

          pubnub.subscribe({
        channels: ['public_chat','receive_master',p_uuid] ,
	        withPresence : true 
    });
	   	pubnub.addListener({
	   		message : function(m){
	   			console.log('message ',JSON.stringify(m))
	   			switch (m.channel){
	   				case 'receive_master' :
	   					updateWidget(m.message)
	   				break;
	   				case 'public_chat' :
	   					 $('#messages').prepend($('<li>').text(m.message.text));
	   				break;
	   				case p_uuid : 
	   					updateWidget(m.message)
	   				break;
	   				default : ;
	   			}
	   		},
	   		presence : function(p){console.log(JSON.stringify(p))},
	   		status : function(s){}

	   	})
}
publish()
function pubnubEmit(r,m){
			console.log(r);
		  	pubnub.publish({channel : 'send_master',message :{room : r,msg :m,uuid : p_uuid}}, function(status, response) {
        })
}
function chat(m){
	 		pubnub.publish({channel : 'public_chat',message : m}, function(status, response) {
        })
}
*/
function fbody(){
/*	screenfull.request();
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	screenfull.request();
	noSleep.enable();
 // some code..
}
	
	if (!screenfull.enabled) {
		screenfull.request();
		noSleep.enable();
	}
	
*/
}
////////common functions
function sendDate(id){
var _date=new Date();
sendId(id,(_date.getHours()*3600000+_date.getMinutes()*60000+_date.getSeconds()*1000+_date.getMilliseconds()));
}

function sendId(id,msg){
	return document.getElementById(id).innerHTML=msg;
	}
////////functions sur div
function openDiv(div,url){
	$( "#"+div ).load( url );
	}


function joinRoom(room){
	openDiv("display", "room/"+room+"");
	pubnubEmit('joinRoom', room);
	_room=room;
	}
function changeRoom(evt){
	if(evt==1){
		roomInt++;
		if(roomInt>=room.length){roomInt=0;}
	}
	if(evt==0){
		roomInt--;
		if(roomInt<0){roomInt=room.length-1;}
	}
	openDiv("display", "room/"+room[roomInt]+"");
	//openDiv("popup", "modal/"+room[roomInt]+"");
	pubnubEmit('joinRoom', room[roomInt]);
	_room=room[roomInt];
	//console.log("room "+room[roomInt]);
};
function togglePopup(){
	if (pop==true){
		
		document.getElementById('popup').style.height="0%";
		pop=false;
	}
	else{
	document.getElementById('popup').style.height="100%";
pop=true;}
}

//////////////socket functions
/*var socket = io.connect({transports: ['websocket', 'polling']});
 //var socket = io(document.location.origin + '/mynamespace');

delivery    = new Delivery(socket);
socket.on('update', function(w) {
			//console.log(w);
			updateWidget(w);       
		});  
	socket.on('retour-message', function (message) {
	console.log(message.text);
  $('#messages').prepend($('<li>').text(message.text));
});         
socket.on('connect', function() {
	return;
});*/

