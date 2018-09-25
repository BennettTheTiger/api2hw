const http = require('http');
const url = require('url');
const resource = require('./resourceResponses.js');
const dataHandler = require('./dataResponses.js');
const query = require('querystring');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// handle POST requests
const handlePost = (request, response, parsedUrl) => {
  // if post is to /addUser (our only POST url)
  if (parsedUrl.pathname === '/addUser') {
    const res = response;

    // uploads come in as a byte stream that we need
    // to reassemble once it's all arrived
    const body = [];

    // if the upload stream errors out, just throw a
    // a bad request and send it back
    request.on('error', (err) => {
      console.dir(err);
      res.statusCode = 400;
      res.end();
    });

    // on 'data' is for each byte of data that comes in
    // from the upload. We will add it to our byte array.
    request.on('data', (chunk) => {
      body.push(chunk);
    });

    // on end of upload stream.
    request.on('end', () => {
      // combine our byte array (using Buffer.concat)
      // and convert it to a string value (in this instance)
      const bodyString = Buffer.concat(body).toString();
      // since we are getting x-www-form-urlencoded data
      // the format will be the same as querystrings
      // Parse the string into an object by field name
      const bodyParams = query.parse(bodyString);

      // pass to our addUser function
      dataHandler.addUser(request, res, bodyParams);
    });
  }
};

const urlStruct = {
  '/': resource.getIndex,
  '/style.css': resource.getStyles,
  index: resource.getIndex,
  '/favicon.ico': resource.favicon,
  '/getUsers': dataHandler.getUsers,
  '/notReal': dataHandler.notReal,
};

const onRequest = (req, res) => {
  const parsedUrl = url.parse(req.url);
  // console.log(`url ${parsedUrl.pathname}`);
  const acceptedTypes = req.headers.accept.split(',');
  // console.log(`acceptedTypes ${acceptedTypes}`);
  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](req, res, acceptedTypes);
  } else if (parsedUrl.pathname === '/addUser') {
    handlePost(req, res, parsedUrl);
  } else {
    resource.unknown(req, res);
  }
};

http.createServer(onRequest).listen(port);

// console.log(`listening on 127.0.0.1: ${port}`);
