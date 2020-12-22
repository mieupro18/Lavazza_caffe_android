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

export default class MachineListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientlist: null,
    };
  }

  async componentDidMount() {
    //clientList = this.props.route.params.clientList;
    //console.log(clientList);
  }

  async componentWillUnmount() {}

  renderSeparator = () => {
    return <View style={styles.renderSeparator} />;
  };
  //handling onPress action
  getListViewItem = item => {
    //Alert.alert(item.key);
    this.props.navigation.replace('connectScreen', {
      ipAddress: item.ipAddress,
    });
  };

  render() {
    //this.setState({clientList: clientList});
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <Image
            style={styles.logoStyleInHeader}
            source={require('../assets/Lavazza-White-Logo-No-Background.png')}
          />
        </View>
        {/*<FlatList
          data={this.props.route.params.clientList}
        renderItem={({item}) => (*/}
        <ScrollView>
          {this.props.route.params.clientList.length === 0 ? (
            <Text style={styles.textStyle}>No Machines Found</Text>
          ) : null}
          {this.props.route.params.clientList.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
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
                          name="chevron-right-circle"
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
    marginTop:10
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
    justifyContent: 'center',
  },
  logoStyleInHeader: {
    width: responsiveScreenWidth(50),
    height: responsiveScreenHeight(5),
    resizeMode: 'contain',
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
    color: '#100A45',
  },
});
