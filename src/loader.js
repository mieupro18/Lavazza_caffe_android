import React, {Component} from 'react';
import {StyleSheet, View, Modal, Text, Image} from 'react-native';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
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
        style={styles.modalStyle}
        onRequestClose={() => {}}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <View style={styles.gifContainer}>
              <Image
                style={styles.gif}
                source={require('../assets/connect.gif')}
              />
            </View>
            <Text style={styles.loadingTextStyle}>{this.props.text}</Text>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalStyle: {
    zIndex: 1100,
  },
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
  gifContainer: {
    borderRadius: responsiveScreenWidth(10),
    overflow: 'hidden',
  },
  gif: {
    width: responsiveScreenWidth(20),
    height: responsiveScreenWidth(20),
    //borderRadius: responsiveScreenWidth(10)
  },
  loadingTextStyle: {
    color: 'gray',
    fontWeight: 'bold',
  },
});

export default Loader;
