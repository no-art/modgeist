var video_out = document.getElementById("video-rec2");
var vid_thumb = document.getElementById("video-rec");
var vidCount  = 0;
var trackii;
var phone;
var ctrl;
//////VIDEOHELPER
    
function vidlogin(form) {
	 phone = window.phone = PHONE({
	    number        : form || "Anonymous", // listen on username line else Anonymous
	    publish_key   : 'pub-c-561a7378-fa06-4c50-a331-5c0056d0163c', // Your Pub Key
	    subscribe_key : 'sub-c-17b7db8a-3915-11e4-9868-02ee2ddab7fe', // Your Sub Key
	    ssl: true,
	    //oneway:true,
	    media:{ audio : true, video : {
       //deviceId: camera.deviceId,
        facingMode: ['environment'],
        height: {ideal: 480		},
        width: {ideal: 640}
				      } 
				  }
	});
	ctrl = window.ctrl = CONTROLLER(phone);
	ctrl.ready(function(){
		ctrl.addLocalStream(vid_thumb);
		streamOk=true;
		pubnubEmit("stream","ready")
		console.log("Logged in as " + form); 
	});
	ctrl.receive(function(session){
	    session.connected(function(session){ video_out.appendChild(session.video);
	    	 trackii= phone.mystream.getVideoTracks()[0];
	    	    window.setTimeout(() => (
      onCapabilitiesReady(trackii.getCapabilities(),true)
    ), 2000);
	 function onCapabilitiesReady(capabilities,ttt) {
    if (capabilities.torch) {
      trackii.applyConstraints({
        advanced: [{torch: ttt}]
      })
      .catch(e => console.log(e));
    }
  }
	     addLog(session.number + " has joined.");
	    vidCount++; });
	    session.ended(function(session) { ctrl.getVideoElement(session.number).remove();
	    	
	    relog()
	   // onCapabilitiesReady(trackii.getCapabilities(),false)
	     addLog(session.number + " has left.");    
	    vidCount--;});
	});
	ctrl.videoToggled(function(session, isEnabled){
		ctrl.getVideoElement(session.number).toggle(isEnabled);
		addLog(session.number+": video enabled - " + isEnabled);
	});
	ctrl.audioToggled(function(session, isEnabled){
		ctrl.getVideoElement(session.number).css("opacity",isEnabled ? 1 : 0.75);
		addLog(session.number+": audio enabled - " + isEnabled);
	});
	return false;
}

function relog(){
			trackii.stop();
	    	ctrl=null;
	    	phone=null;
	    	vidlogin(r_uuid);
}

function makeCall(form){
	if (!window.phone) alert("Login First!");
	var num = form;
	if (phone.number()==num) return false; // No calling yourself!
	ctrl.isOnline(num, function(isOn){
		if (isOn) ctrl.dial(num);
		else ;
	});
	return false;
}

function mute(){
	var audio = ctrl.toggleAudio();
//	if (!audio) $("#mute").html("Unmute");
//	else $("#mute").html("Mute");
}

function end(){
	ctrl.hangup();
	pubnubEmit("stream","closed")
	streamOk=false;
}

function pause(){
	var video = ctrl.toggleVideo();
//	if (!video) $('#pause').html('Unpause'); 
//	else $('#pause').html('Pause'); 
}

function getVideo(number){
	return $('*[data-number="'+number+'"]');
}

function addLog(log){
	console.log(log)
	//$('#logs').append("<p>"+log+"</p>");
}

function errWrap(fxn, form){
	try {
		addLog(form)
		return fxn(form);

	} catch(err) {
		streamOk=false;
		alert("WebRTC is currently only supported by Chrome, Opera, and Firefox");
		return false;
	}
}
/////////////VIDEOHELPER