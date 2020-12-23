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

export const getMachineList = async function() {
  var ipAddress;
  var subnetMask;
  var clientList = [];
  await NetInfo.fetch().then(async state => {
    console.log('Connection type', state.type);
    console.log('Is connected?', state.isConnected);
    console.log('Details', state.details);
    //console.log();
    if (state.type === 'wifi' && state.isConnected === true) {
      console.log('dv');
      ipAddress = state.details.ipAddress;
      subnetMask = state.details.subnet;

      //console.log("ip",ipadr)
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
      //var udp = require('dgram');
      // creating a client socket
      var client = dgram.createSocket('udp4');

      //buffer msg
      //var data = 'hello';
      client.bind(55555, '0.0.0.0', e => {
        if (e) {
          console.log(e);
        }
      });

      client.once('listening', function() {
        //var buf = Buffer.from(JSON.stringify('msg'));
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
        //console.log(clientList);
      });
      await sleep(5000);
      client.close();
      //console.log('fun', clientList);
    } else {
      console.log('Wifi is not connected');
    }
  });
  return clientList;
};
