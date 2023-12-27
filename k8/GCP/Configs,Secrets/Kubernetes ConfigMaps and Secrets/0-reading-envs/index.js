const language = process.env.LANGUAGE;
const API_KEY = process.env.API_KEY;
const port = process.env.PORT || 3000;

var http = require('http');
var server = http.createServer(function (request, response) {
  response.write(`Language: ${language}\n`);
  response.write(`API Key: ${API_KEY}\n`);
  response.end(`\n`);
});
server.listen(port, () => console.log(`Running on port: ${port}`));
