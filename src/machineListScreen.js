import React, {Component} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
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
//var clientList = [];
import {SUCCESS, FAILURE, TOKEN} from './macros';
import {getTimeoutSignal, getMachineList} from './commonApis';
import Loader from './loader';

export default class MachineListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      clientList: this.props.route.params.clientList,
    };
  }

  async componentDidMount() {}

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

  renderSeparator = () => {
    return <View style={styles.renderSeparator} />;
  };
  //handling onPress action
  getListViewItem = async item => {
    //Alert.alert(item.key);
    await this.getProductList(item.ipAddress);
  };
  onRefresh = async () => {
    this.setState({isLoading: true});
    var clientList = await getMachineList();
    this.setState({isLoading: false});
    if (clientList === [] || clientList === undefined || clientList === null) {
      Alert.alert('', 'Something went wrong', [{text: 'Ok'}]);
    } else {
      console.log(clientList);
      this.setState({
        clientList: clientList,
      });
    }
  };

  render() {
    //this.setState({clientList: clientList});
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
            onPress={() => this.onRefresh()}
            size={responsiveScreenHeight(4)}
            style={styles.refreshIconStyle}
          />
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => {
                this.onRefresh();
              }}
            />
          }>
          {this.state.clientList.length === 0 ? (
            <Text style={styles.textStyle}>No Machines Found</Text>
          ) : null}
          {this.state.clientList.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={{paddingHorizontal:8,}}
                onPress={this.getListViewItem.bind(this, item)}>
                <Card>
                  <CardItem>
                    <View style={styles.cardContainer}>
                      {/*<View>
                      <Image
                        style={styles.productImageStyleInCard}
                        source={}
                      />
                    </View>*/}
                      <View style={styles.productNameContainerInCard}>
                        <Text style={styles.productNameTextStyle}>
                          {item.id}
                        </Text>
                      </View>
                      <View style={styles.plusIconContainerInCard}>
                        <MaterialCommunityIcons
                          name="chevron-right"
                          size={responsiveScreenHeight(4)}
                          style={styles.plusIconStyleInCard}
                        />
                      </View>
                    </View>
                  </CardItem>
                </Card>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {/*ItemSeparatorComponent={this.renderSeparator}
                />*/}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 10,
    fontSize: 20,
    height: 44,
    marginLeft: 20,
  },
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
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: responsiveScreenWidth(100),
  },
  productImageStyleInCard: {
    width: responsiveScreenWidth(18),
    height: responsiveScreenWidth(18),
    borderRadius: responsiveScreenWidth(5),
  },
  productNameContainerInCard: {
    justifyContent: 'center',
    width: responsiveScreenWidth(80),
  },
  productNameTextStyle: {
    textShadowColor: '#100A45',
    fontSize: responsiveScreenFontSize(1.8),
    fontWeight: 'bold',
    color: '#100A45',
  },
  plusIconContainerInCard: {
    justifyContent: 'center',
    width: responsiveScreenWidth(20),
  },
  plusIconStyleInCard: {
    color: '#000',
  },
});
