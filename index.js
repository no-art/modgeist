//ffmpeg -i sound1.wav -dash 1 sound1.webm
//for file in *.*; do `ffmpeg -i "$file" -dash 1 "${file%.*}.webm"`;done
const ortc = require('ibtrealtimesjnode').IbtRealTimeSJNode;
var socket=new ortc();

socket.setConnectionMetadata('clientConnMeta');
socket.setClusterUrl('https://ortc-developers.realtime.co/server/ssl/2.1/')
socket.connect('HV1kA2', 'master');
socket.onConnected = function (o) {
      console.log('connected')
   }
var fs  = require('fs');
var formidable = require('formidable');
var x=1;
var compression=require('compression');
var express = require('express');
var serveStatic = require('serve-static');
var app = express();
app.use(compression());
app.use(serveStatic(__dirname+"/www"));
var ff=__dirname;
app.post('/upload', function(req, res) {
  console.log('up')
 var form = new formidable.IncomingForm();
   form.uploadDir = (__dirname+'/www/upload');
    form.on('file', function(field, file) {
            filename ='up'+ Date.now() + '-' + 'file.png';
            fs.rename(file.path,form.uploadDir + "/"+filename, function(err){
              if(err){
                console.log('File could not be saved.');
              }else{
                console.log('fs ok')
                pubnubEmit('file',filename)
              };
            });
        });
   form.parse(req, function(err, fields, files) {
  });
 });
var server=app.listen(3000);
function pubnubEmit(r,m){ 
        socket.send('send_master',JSON.stringify({room : "master",msg :{i :r,ii :m}, uuid:"modgeist"}));
}
