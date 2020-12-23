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
import {getTimeoutSignal, getMachineList} from './commonApis';

var retry_attempt = 0;
const max_retry_attempt = 6;
var PI_SERVER_ENDPOINT = null;

export default class ConnectScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  async componentDidMount() {
    /*PI_SERVER_ENDPOINT =
      'http://' + this.props.route.params.ipAddress + ':9876';
    console.log(PI_SERVER_ENDPOINT);*/
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

  onConnect = async () => {
    this.setState({
      isLoading: true,
    });
    var clientList = await getMachineList();
    console.log(clientList);
    this.setState({isLoading: false});
    if (clientList === [] || clientList === undefined || clientList === null) {
      Alert.alert('', 'Something went wrong', [{text: 'Ok'}]);
    } else {
      console.log(clientList);
      this.props.navigation.navigate('machineListScreen', {
        clientList: clientList,
      });
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

          <View style={styles.gifContainer}>
            <Image
              style={styles.gif}
              source={require('../assets/connect.gif')}
            />
          </View>
          {this.state.isLoading ? (
            <View style={styles.loadingActivityContainer}>
              <ActivityIndicator size="small" color="#100A45" />
              <Text style={styles.loadingActivityTextStyle}>Connecting</Text>
            </View>
          ) : (
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
