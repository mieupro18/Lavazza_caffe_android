import React, {Component} from 'react';
import {
  StyleSheet,
  Image,
  View,
  TouchableHighlight,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

import dgram from 'react-native-udp';

import {Picker} from '@react-native-picker/picker';

export default class SearchDevicesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //modeNumber: 0,
      isLoading: false,
    };
  }

  async componentDidMount() {}

  async componentWillUnmount() {}

  onSubmit = async () => {
    this.setState({isLoading: true});
    this.orgWifiMode();
    /*console.log(this.state.modeNumber);
    if (this.state.modeNumber === 0) {
      Alert.alert('', 'Please Select Valid Mode', [{text: 'Ok'}]);
    } else {
      if (this.state.modeNumber === 1) {
        
      } else if (this.state.modeNumber === 2) {
        this.props.navigation.navigate('connectScreen', {
          ipAddress: '192.168.5.1',
        });
      }
    }*/
  };

  orgWifiMode = async () => {
    var ipAddress;
    var subnetMask;
    var clientList = [];
    await NetInfo.fetch().then(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      console.log('Details', state.details);
      //console.log();
      ipAddress = state.details.ipAddress;
      subnetMask = state.details.subnet;
    });
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
          Alert.alert('', err, [{text: 'Ok'}]);
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
    setTimeout(async () => {
      client.close();
      if (clientList === []) {
        Alert.alert('', 'Something went wrong', [{text: 'Ok'}]);
      } else {
        console.log(clientList);
      }
      //Alert.alert('', clientList, [{text: 'Ok'}]);
      this.setState({isLoading: false});
      this.props.navigation.navigate('machineListScreen', {
        clientList: clientList,
      });
    }, 5000);
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.centeredViewContainer}>
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              source={require('../assets/lavazza_logo_with_year.png')}
            />
          </View>
          <Text style={styles.textStyle}>Search Devices</Text>
          {/*<View style={styles.pickerContainer}>
            <Picker
              selectedValue={this.state.modeNumber}
              //mode="dropdown"
              style={styles.pickerStyle}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({modeNumber: itemValue})
              }>
              <Picker.Item
                label="--- Select Mode ---"
                value={0}
                color="#grey"
              />
              <Picker.Item label="Organization Wi-Fi" value={1} color="#000" />
              <Picker.Item label="Machine Wi-Fi" value={2} color="#000" />
            </Picker>
            </View>*/}
          {this.state.isLoading ? (
            <View style={styles.loadingActivityContainer}>
              <ActivityIndicator size="small" color="#100A45" />
              <Text style={styles.loadingActivityTextStyle}>Searching...!</Text>
            </View>
          ) : (
            <View style={styles.connectButtonContainer}>
              <TouchableHighlight
                underlayColor="#100A45"
                style={styles.connectButtonStyle}
                onPress={() => {
                  this.onSubmit();
                  //this.setState({isLoading:true})
                }}>
                <Text style={styles.connectButtonTextStyle}>Search</Text>
              </TouchableHighlight>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  centeredViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    height: responsiveScreenHeight(13),
    alignItems: 'center',
  },
  logo: {
    height: '100%',
    resizeMode: 'contain',
  },
  pickerContainer: {
    alignItems: 'center',
  },
  pickerStyle: {
    marginTop: 10,
    height: 35,
    width: 200,
    alignItems: 'center',
    //color: '#100A45',
    //backgroundColor: '#EBEBEB',
  },
  textStyle: {
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: responsiveScreenFontSize(2),
  },
  loadingActivityContainer: {
    flexDirection: 'row',
    marginTop: '5%',
  },
  loadingActivityTextStyle: {
    color: '#100A45',
    fontWeight: 'bold',
    fontSize: responsiveScreenFontSize(1.8),
  },
  connectButtonContainer: {
    alignItems: 'center',
    marginTop: '5%',
  },
  connectButtonStyle: {
    width: responsiveScreenWidth(30),
    height: responsiveScreenHeight(5),
    borderRadius: responsiveScreenHeight(1),
    backgroundColor: '#100A45',
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectButtonTextStyle: {
    color: 'white',
    fontSize: responsiveScreenFontSize(1.5),
  },
});
