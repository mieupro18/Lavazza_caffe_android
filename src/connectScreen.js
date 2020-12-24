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
import {Picker} from '@react-native-picker/picker';
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

var retry_attempt = 0;
const max_retry_attempt = 6;

export default class ConnectScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      modeNumber: 0,
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
      })
      .catch(async e => {
        Alert.alert(
          '',
          'Please check your wifi connection with the lavazza caffè machine',
          [{text: 'ok'}],
        );
        console.log(e);
        this.setState({isLoading: false});
      });
  };

  onConnect = async () => {
    console.log(this.state);
    if (this.state.modeNumber === 0) {
      Alert.alert('', 'Please Select Mode', [{text: 'ok'}]);
      this.setState({isLoading: false});
    } else if (this.state.modeNumber === 1) {
      setTimeout(async () => {
        this.props.navigation.navigate('machineListScreen');
        this.setState({isLoading: false});
      }, 500);
    } else if (this.state.modeNumber === 2) {
      await this.getProductList('192.168.5.1');
    }
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
          

          {this.state.isLoading ? (
            <View style={{alignItems:'center'}}>
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
          ) : (
            <View style>
              <Text style={{fontSize: 15,alignSelf:'center'}}>Enjoy Your Coffee</Text>
              <Text style={{marginTop:10, fontSize: 15}}>Mode</Text>
              <View style={styles.pickerContainer}>
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
                  <Picker.Item
                    label="Organization Wi-Fi"
                    value={1}
                    color="#000"
                  />
                  <Picker.Item label="Machine Wi-Fi" value={2} color="#000" />
                </Picker>
              </View>
              <View style={styles.connectButtonContainer}>
                <TouchableHighlight
                  underlayColor="#100A45"
                  style={styles.connectButtonStyle}
                  onPress={() => {
                    this.setState({isLoading: true});
                    this.onConnect();
                  }}>
                  <Text style={styles.connectButtonTextStyle}>Connect</Text>
                </TouchableHighlight>
              </View>
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
  },
  pickerStyle: {
    marginTop: 10,
    height: 35,
    width: 200,
    alignItems: 'center',
    //color: '#100A45',
    backgroundColor: '#EBEBEB',
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
