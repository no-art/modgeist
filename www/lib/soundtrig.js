

if('webkitAudioContext' in window || 'AudioContext' in window ) {
	(function(){
		var d=document.createElement("div");
		 d.id="contextaudio";
		 document.body.appendChild(d);
		 d.style.width="100%";
		 d.style.height="100%";
		 d.style.position="absolute";
		 d.style.top="0px";
		 d.style.left="0px";
		d.onclick=function(){
		document.body.removeChild(d);
		var c,o;
         c = new (window.AudioContext || window.webkitAudioContext)();
         o = c.createOscillator();
        o.connect(c.destination);
        o.start();
        o.disconnect(c.destination)
        o.stop();
    	}
     })();
  }
  if(window.DeviceOrientationEvent){
	//	var xxx=20,yyy=20,zzz=20;
		window.ondevicemotion = function(event) {
	 xxx = event.accelerationIncludingGravity.x; 
	}
}