import React, {Component} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Image,
  View,
  Alert,
  Text,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Card, CardItem} from 'native-base';
import {ScrollView} from 'react-native-gesture-handler';
import {SUCCESS, TOKEN} from './macros';
import {getTimeoutSignal, getMachineList} from './commonApis';
import Loader from './loader';
import NetInfo from '@react-native-community/netinfo';

export default class MachineListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      clientList: [],
      initialMount: true,
      errorMessage: null,
    };
  }

  async componentDidMount() {
    await this.getDevices();
  }

  async componentWillUnmount() {}

  getProductList = async ipAddress => {
    this.setState({isLoading: true});
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

  onDeviceClick = async item => {
    await this.getProductList(item.ipAddress);
  };

  getDevices = async () => {
    this.setState({isLoading: true});
    await NetInfo.fetch().then(async state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      console.log('Details', state.details);
      if (state.type === 'wifi' && state.isConnected === true) {
        var clientList = await getMachineList(
          state.details.ipAddress,
          state.details.subnet,
        );
        this.setState({isLoading: false});
        //console.log("ndunb",clientList)
        if (
          clientList.length === 0 ||
          clientList === undefined ||
          clientList === null
        ) {
          //console.log("jbcj")
          this.setState({
            errorMessage: 'No Devices Found\nSomething went wrong',
          });
        } else {
          //console.log(clientList);
          this.setState({
            clientList: clientList,
          });
        }
      } else {
        this.setState({errorMessage: 'Please Connect to the Wi-Fi'});
        this.setState({isLoading: false});
      }
      if (this.state.initialMount === true) {
        this.setState({initialMount: false});
      }
    });
  };

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <Loader loading={this.state.isLoading} />
        <View style={styles.headerContainer}>
          <View style={styles.emptyStyle} />
          <Image
            style={styles.logoStyleInHeader}
            source={require('../assets/Lavazza-White-Logo-No-Background.png')}
          />
          <MaterialCommunityIcons
            name="reload"
            onPress={() => this.getDevices()}
            size={responsiveScreenHeight(4)}
            style={styles.refreshIconStyle}
          />
        </View>
        <ScrollView>
          {this.state.clientList.length === 0 &&
          this.state.initialMount === false ? (
            <Text style={styles.textStyle}>{this.state.errorMessage}</Text>
          ) : null}
          {this.state.clientList.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={styles.touchableOpacityStyle}
                onPress={this.onDeviceClick.bind(this, item)}>
                <Card>
                  <CardItem>
                    <View style={styles.cardContainer}>
                      <View style={styles.deviceNameContainerInCard}>
                        <Text style={styles.deviceNameTextStyle}>
                          {item.id}
                        </Text>
                      </View>
                      <View style={styles.arrowIconContainerInCard}>
                        <MaterialCommunityIcons
                          name="chevron-right"
                          size={responsiveScreenHeight(4)}
                          style={styles.arrowIconStyleInCard}
                        />
                      </View>
                    </View>
                  </CardItem>
                </Card>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  textStyle: {
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  renderSeparator: {
    height: 1,
    width: '100%',
    backgroundColor: '#000',
  },
  headerContainer: {
    backgroundColor: '#100A45',
    height: responsiveScreenHeight(7),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  emptyStyle: {
    width: responsiveScreenWidth(10),
  },
  logoStyleInHeader: {
    width: responsiveScreenWidth(80),
    height: responsiveScreenHeight(5),
    resizeMode: 'contain',
  },
  refreshIconStyle: {
    width: responsiveScreenWidth(10),
    color: '#fff',
  },
  touchableOpacityStyle: {
    paddingHorizontal: 8,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: responsiveScreenWidth(100),
  },
  deviceNameContainerInCard: {
    justifyContent: 'center',
    width: responsiveScreenWidth(80),
  },
  deviceNameTextStyle: {
    textShadowColor: '#100A45',
    fontSize: responsiveScreenFontSize(1.8),
    fontWeight: 'bold',
    color: '#100A45',
  },
  arrowIconContainerInCard: {
    justifyContent: 'center',
    width: responsiveScreenWidth(20),
  },
  arrowIconStyleInCard: {
    color: '#000',
  },
});
