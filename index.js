//ffmpeg -i sound1.wav -dash 1 sound1.webm
//for file in *.*; do `ffmpeg -i "$file" -dash 1 "${file%.*}.webm"`;done

var fs  = require('fs');
var formidable = require('formidable');
var x=1;
var compression=require('compression');
var express = require('express');
var serveStatic = require('serve-static');
var app = express();
app.use(compression());
app.use(serveStatic(__dirname+"www"));
var ff=__dirname;
app.post('/upload', function(req, res) {
 var form = new formidable.IncomingForm();
   form.uploadDir = (__dirname+'www/upload');
    form.on('file', function(field, file) {
            filename ='up'+ Date.now() + '-' + 'file.png';
            fs.rename(file.path,form.uploadDir + "/"+filename, function(err){
              if(err){
                console.log('File could not be saved.');
              }else{};
            });
        });
   form.parse(req, function(err, fields, files) {
  });
 });
var server=app.listen(3000);
