import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { WebView } from 'react-native-webview';

export default class Repository extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('repository').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  render() {
    const { navigation } = this.props;
    const uri = navigation.getParam('repository').html_url;
    return <WebView source={{ uri }} style={{ flex: 1 }} />;
  }
}
