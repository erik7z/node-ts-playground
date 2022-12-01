var http = require('http');
var fs = require('fs');
const port = process.env.PORT || 3000;

var server = http.createServer(function (request, response) {
  fs.readFile('./config/config.json', function (err, config) {
    if (err) return console.log(err);
    const language = JSON.parse(config).LANGUAGE;
    fs.readFile('./secret/secret.json', function (err, secret) {
      if (err) return console.log(err);
      const API_KEY = JSON.parse(secret).API_KEY;
      response.write(`Language: ${language}\n`);
      response.write(`API Key: ${API_KEY}\n`);
      response.end(`\n`);
    });
  });
});

server.listen(port, () => console.log(`Running on port: ${port}`));

