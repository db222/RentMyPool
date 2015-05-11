// grab the configured server
var app = require('./server_config.js');

var port = 8080;
// activate the server on the port stated
app.listen(port);

console.log('Listening on port...' + port);
