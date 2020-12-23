import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
  Text,
  Image,
} from 'react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
class Loader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.loading);
    return (
      <Modal
        transparent={true}
        animationType={'none'}
        visible={this.props.loading}
        style={{zIndex: 1100}}
        onRequestClose={() => {}}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <Image
              style={styles.gif}
              source={require('../assets/cup_loading.gif')}
            />
            <Text style={{color: 'gray',fontWeight:'bold'}}>Loading...</Text>
            {/*<ActivityIndicator animating={this.props.loading} color="#100A45" />*/}
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  activityIndicatorWrapper: {
    backgroundColor: '#fff',
    height: responsiveScreenWidth(30),
    width: responsiveScreenWidth(30),
    borderRadius: responsiveScreenWidth(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  gif: {
    width: responsiveScreenWidth(20),
    height: responsiveScreenWidth(20),
  },
});

export default Loader;
