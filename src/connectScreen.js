import React, {Component} from 'react';
import {
  StyleSheet,
  Image,
  View,
  TouchableHighlight,
  Alert,
  ActivityIndicator,
  AppState,
  Text,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-community/async-storage';
import BackgroundTimer from 'react-native-background-timer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//import {Picker} from '@react-native-picker/picker';
import RadioButtonRN from 'radio-buttons-react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

import {
  LAVAZZA_SERVER_ENDPOINT,
  INTERVAL_BETWEEN_SENDING_FEEDBACK_DATA,
  TOKEN,
  SUCCESS,
} from './macros';
import {getTimeoutSignal} from './commonApis';
import Loader from './loader';

var retry_attempt = 0;
const max_retry_attempt = 6;
//const wifiModes = ['Organization', 'Machine'];
const orgWifi = '  Organization';
const machineWifi = '  Machine';
const wifiModes = [
  {
    label: orgWifi,
  },
  {
    label: machineWifi,
  },
];

export default class ConnectScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      mode: null,
      modeNumber: -1,
      hideConnectButton: false,
    };
  }

  async componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  async componentWillUnmount() {
    BackgroundTimer.stopBackgroundTimer(this.intervalId);
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  // Sending collected Feedback data to remote server
  // when mobile gets internet connection
  sendFeedbackData = async feedbackData => {
    const netInfo = await NetInfo.fetch();
    console.log('Internet Connection :', netInfo.isInternetReachable);
    if (netInfo.isInternetReachable) {
      fetch(LAVAZZA_SERVER_ENDPOINT + '/feedback', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          tokenId: TOKEN,
        },
        signal: (await getTimeoutSignal(30000)).signal,
        body: JSON.stringify(feedbackData),
      })
        .then(response => response.json())
        .then(async resultData => {
          console.log(resultData);
          if (resultData.status === SUCCESS) {
            console.log('data send');
            BackgroundTimer.stopBackgroundTimer(this.intervalId);
            AsyncStorage.removeItem('feedbackData');
          }
        })
        .catch(async e => {
          console.log(e);
        });
    } else {
      console.log('no internet connection');
    }
    retry_attempt = retry_attempt + 1;
    if (retry_attempt >= max_retry_attempt) {
      BackgroundTimer.stopBackgroundTimer(this.intervalId);
      retry_attempt = 0;
    }
  };

  handleAppStateChange = async state => {
    try {
      if (state === 'background') {
        console.log('background');
        var feedbackData = JSON.parse(
          await AsyncStorage.getItem('feedbackData'),
        );
        if (feedbackData === null) {
          console.log('null data');
        } else {
          console.log(feedbackData);
          this.intervalId = BackgroundTimer.runBackgroundTimer(async () => {
            console.log(feedbackData);
            await this.sendFeedbackData(feedbackData);
          }, INTERVAL_BETWEEN_SENDING_FEEDBACK_DATA);
        }
      } else if (state === 'active') {
        console.log('active');
        BackgroundTimer.stopBackgroundTimer(this.intervalId);
        retry_attempt = 0;
      }
    } catch (error) {
      console.log('Background error', error);
    }
  };

  getProductList = async ipAddress => {
    //this.setState({isLoading: true});
    const PI_SERVER_ENDPOINT = 'http://' + ipAddress + ':9876';
    console.log('get Product Info', PI_SERVER_ENDPOINT, TOKEN);
    fetch(PI_SERVER_ENDPOINT + '/productInfo', {
      headers: {
        tokenId: TOKEN,
      },
      signal: (await getTimeoutSignal(5000)).signal,
    })
      .then(response => response.json())
      .then(async resultData => {
        console.log(resultData);
        if (resultData.status === SUCCESS) {
          this.props.navigation.navigate('dispenseScreen', {
            productList: resultData.data,
            machineName: resultData.machineName,
            machineId: resultData.machineId,
            PI_SERVER_ENDPOINT: PI_SERVER_ENDPOINT,
          });
        } else {
          Alert.alert('', 'Something Went Wrong...Please reconnect', [
            {text: 'Ok'},
          ]);
        }
        this.setState({isLoading: false});
        //this.setState({hideConnectButton: false});
      })
      .catch(async e => {
        Alert.alert(
          '',
          'Please check your wifi connection with the lavazza caffè machine',
          [{text: 'ok'}],
        );
        console.log(e);
        this.setState({isLoading: false});
        //this.setState({hideConnectButton: false});
      });
  };

  onConnect = async () => {
    console.log(this.state);
    if (this.state.mode === null) {
      Alert.alert('', 'Please Select Mode', [{text: 'ok'}]);
    } else if (this.state.mode === orgWifi) {
      this.setState({hideConnectButton: true});
      await this.props.navigation.navigate('machineListScreen');
      setTimeout(async () => {
        //this.setState({hideConnectButton: true});
        this.setState({hideConnectButton: false});
      }, 1000);
    } else if (this.state.mode === machineWifi) {
      this.setState({isLoading: true});
      await this.getProductList('192.168.5.1');
    }
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <Loader loading={this.state.isLoading} text="Connecting..." />
        <View style={styles.centeredViewContainer}>
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              source={require('../assets/lavazza_logo_with_year.png')}
            />
          </View>

          {/*this.state.isLoading ? (
            <View style={{alignItems: 'center'}}>
              <View style={styles.gifContainer}>
                <Image
                  style={styles.gif}
                  source={require('../assets/connect.gif')}
                />
              </View>
              <View style={styles.loadingActivityContainer}>
                <ActivityIndicator size="small" color="#100A45" />
                <Text style={styles.loadingActivityTextStyle}>Connecting</Text>
              </View>
            </View>
          ) : (*/}
          <View>
            <View style={styles.textContainer}>
              <Text style={styles.modeTextStyle}>Select Wi-Fi Mode</Text>
              <MaterialCommunityIcons
                name="information-variant"
                onPress={() => {
                  Alert.alert(
                    'Mode Info',
                    orgWifi +
                      '\n     This is organization wifi mode \n\n' +
                      machineWifi +
                      '\n     This is machine wifi mode',
                    [{text: 'ok'}],
                  );
                }}
                size={responsiveScreenHeight(3)}
                style={styles.infoIconStyleInCard}
              />
            </View>

            <RadioButtonRN
              data={wifiModes}
              style={{marginTop: 10}}
              textStyle={{fontSize: responsiveScreenFontSize(2)}}
              // animationTypes={['shake']}
              initial={this.state.modeNumber}
              //activeColor='#100A45'
              selectedBtn={e => {
                this.setState({mode: e.label});
                if (e.label === orgWifi) {
                  this.setState({modeNumber: 1});
                } else if (e.label === machineWifi) {
                  this.setState({modeNumber: 2});
                } else {
                  this.setState({modeNumber: -1});
                }
              }}
              box={false}
              //circleSize={15}
              icon={
                <MaterialCommunityIcons
                  name="circle-slice-8"
                  size={25}
                  color="#100A45"
                />
              }
            />
            {!this.state.hideConnectButton ? (
              <View style={styles.connectButtonContainer}>
                <TouchableHighlight
                  underlayColor="#100A45"
                  style={styles.connectButtonStyle}
                  onPress={() => {
                    this.onConnect();
                  }}>
                  <Text style={styles.connectButtonTextStyle}>Connect</Text>
                </TouchableHighlight>
              </View>
            ) : null}
          </View>
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
  textContainer: {
    //flex:1,
    alignContent: 'flex-start',
    //marginTop: 20,
    //alignContent:'flex-start',
    flexDirection: 'row',
    //alignItems:'center'
    //justifyContent:'space-between',
  },
  modeTextStyle: {
    //paddingLeft: 45,
    //justifyContent:'center',
    //alignSelf: 'center',
    fontSize: responsiveScreenFontSize(2),
    color: '#000000',
    fontWeight: 'normal',
  },
  infoIconStyleInCard: {
    alignSelf: 'center',
    justifyContent: 'center',
    paddingLeft: responsiveScreenWidth(1),
    color: '#100A45',
  },
  gifContainer: {
    borderRadius: responsiveScreenWidth(25),
    overflow: 'hidden',
  },
  gif: {
    width: responsiveScreenWidth(50),
    height: responsiveScreenWidth(50),
  },
  pickerContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
  pickerStyle: {
    marginTop: 10,
    height: 35,
    width: 200,
    alignItems: 'center',
    color: '#747474',
    //color: '#100A45',
    //backgroundColor: 'transparent',
    //textAlign:'center',
    borderColor: '#EBEBEB',
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
