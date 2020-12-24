import NetInfo from '@react-native-community/netinfo';
import dgram from 'react-native-udp';

// eslint-disable-next-line no-undef
export const getTimeoutSignal = async function(timeout) {
  // eslint-disable-next-line no-undef
  const controller = new AbortController();
  setTimeout(() => {
    controller.abort();
  }, timeout);
  return controller;
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const getMachineList = async function(ipAddress, subnetMask) {
  var clientList = [];
  const ipadrs = ipAddress.split('.');
  const subnets = subnetMask.split('.');

  let networks = [],
    broadcasts = [];

  for (var i in ipadrs) {
    networks[i] = ipadrs[i] & subnets[i];
  }

  console.log('netaddress: ', networks.join('.')); // netaddress:  130.45.32.0

  for (let i in networks) {
    broadcasts[i] = networks[i] | (~subnets[i] + 256);
  }
  const broadcastIpAddress = broadcasts.join('.');
  console.log('broadcast address: ', broadcastIpAddress); // broadcast address:  130.45.47.255

  // creating a client socket
  var client = dgram.createSocket('udp4');

  client.bind(55555, '0.0.0.0', e => {
    if (e) {
      console.log(e);
    }
  });

  client.once('listening', function() {
    client.send('hello', 0, 5, 41234, broadcastIpAddress, function(err) {
      if (err) {
        console.log(err);
      }
      console.log('Sent');
    });
  });

  client.on('message', function(msg, info) {
    console.log('Data received from server : ' + msg.toString());
    msg = JSON.parse(msg);
    let data = {
      ipAddress: info.address,
      id: msg.deviceId,
    };
    clientList.push(data);
    console.log(
      'Received %d bytes from %s:%d\n',
      msg.length,
      info.address,
      info.port,
    );
  });
  await sleep(5000);
  client.close();

  return clientList;
};
