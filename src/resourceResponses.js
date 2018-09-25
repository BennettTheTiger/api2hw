// THIS MODULE RESPONDS WITH THE RESOURCES HTML/CSS
const fs = require('fs');

// load resources
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const styles = fs.readFileSync(`${__dirname}/../client/style.css`);

// function to send response
const respond = (request, response, content, type, code) => {
  // set status code and content type
  response.writeHead(code, { 'Content-Type': type });
  // write the content string or buffer to response
  response.write(content);
  // send the response to the client
  response.end();
};

const getIndex = (request, response) => {
  respond(request, response, index, 'text/html', 200);
};

// function to handle the css
const getStyles = (request, response) => {
  respond(request, response, styles, 'text/css', 200);
};

// function to handle the favicon requests tell it 204 NO Content
const favicon = (request, response) => {
  respond(request, response, null, 'image/webp', 204);
};

const unknown = (request, response) => {
  respond(request, response, JSON.stringify({ message: 'The page you are looking for could not be found', id: 'Resource Not Found' }), 'application/json', 404);
};


module.exports = {
  getIndex,
  getStyles,
  favicon,
  unknown,
};
