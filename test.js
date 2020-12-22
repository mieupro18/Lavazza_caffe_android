var Buffer = require('buffer');
var udp = require('dgram');
// creating a client socket
var client = udp.createSocket('udp4');

//buffer msg
var data = 'hello';


client.on('message', function(msg, info) {
  console.log('Data received from server : ' + msg.toString());
  console.log(
    'Received %d bytes from %s:%d\n',
    msg.length,
    info.address,
    info.port,
  );
});

//sending msg
client.send(data, 41234, '192.168.0.255', function(error) {
  if (error) {
    client.close();
  } else {
    console.log('Data sent !!!');
  }
});

setInterval(async function() {
  console.log('waiting');
}, 5000);


