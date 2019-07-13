import React, { Component } from 'react';

import { WebView } from 'react-native';

export default class Repository extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('repository').name,
  });

  state = ({ navigation }) => ({
    repository: navigation.getParam('repository').name,
  });

  render() {
    const { repository } = this.state;

    return (
      <WebView source={{ uri: repository.html_url }} style={{ flex: 1 }} />
    );
  }
}
