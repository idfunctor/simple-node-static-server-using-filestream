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
function accessFile(filePath){
  return new Promise((resolve,reject)=>{
    fs.access(filePath, fs.F_OK, error=>{
      if(!error) resolve(filePath)
      else reject(filePath)
    })
  });
};
//function to stream these files on being requested
function sendFile(filePath){
  return new Promise((resolve, reject)=>{
    let fileStream = fs.createReadStream(filePath);
    fileStream.on("open", ()=>{
      resolve(fileStream);
    });
    fileStream.on("error", ()=>{
      reject(fileStream);
    });
  });
};


function server(req,res){
  let baseURI = url.parse(req.url, true);
  var routeURL = __dirname + (baseURI.pathname === '/' ? '/index.htm' : baseURI.pathname);
  console.log(routeURL);
  let filetype = path.extname(routeURL);
  let contentType = mimetypes[filetype];
  accessFile(routeURL)
    .then(sendFile)
    .then((content)=>{
      res.writeHead(200, {"Content-type" : contentType});
      content.pipe(res);
    }).catch(error=>{
      console.log(error)
    });
};
//

//create HTTP SERVER at 3000
http.createServer((request,response)=>{
  server(request,response);
}).listen(3000, ()=>{console.log("server running at 3000")});
