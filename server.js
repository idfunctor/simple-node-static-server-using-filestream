'use strict';
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
var mimetypes = {
  '.htm': 'text/html',
  '.json': 'application/json',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.css': 'text/css',
  '.js': 'application/javascript'
};
//function to read html files and other mimetypes
//function to send these files on being requested

function server(req,res){
  let baseURI = url.parse(req.url, true);
  var routeURL = __dirname + (baseURI.pathname === '/' ? '/index.htm' : baseURI.pathname);
  console.log(routeURL);
  fs.access(routeURL, fs.F_OK, error=>{
    if (!error){
      //read the file...purposely using readFile() and not stream to show callback hell and bad resource hogging programming
      fs.readFile(routeURL,(error, content)=>{
        let filetype = path.extname(routeURL);
        let contentType = mimetypes[filetype];
        if(!error){
        res.writeHead(200, {'Content-type':contentType});
        res.end(content, 'utf-8');}
      });
    } else {
      //if reading error then 404
      res.writeHead(404, {'Content-type':'text/html'});
      res.end("content not found", 'utf-8');
          }
  });
};

//create HTTP SERVER at 3000
http.createServer((request,response)=>{
  server(request,response);
}).listen(3000, ()=>{console.log("server running at 3000")});
