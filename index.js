var net = require('net');
var client = new net.Socket();
const frisby = require('frisby');

client.connect(54321, '172.16.3.53', function() {
	console.log('Connected');
	client.write('{"data":{"id": "termsContent" ,"command": "getElementLabelChild","numberChild": "0"}}');
});

var i = 0;

client.on('data', function(data) {
	console.log('Received in NodeJS: ' + JSON.parse(data));
	console.log(JSON.parse(data))
	i++;
	if(i==1)
		client.destroy();
});
client.on('close', function() {
	console.log('Connection closed');
});

