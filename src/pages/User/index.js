import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    page: 1,
    loading: true,
  };

  componentDidMount() {
    this.load();
  }

  loadMore = async () => {
    let { page } = this.state;
    page += 1;
    await this.setState({ page });
    this.load();
  };

  refreshList = async () => {
    await this.setState({ page: 1 });
    this.load();
  };

  handleNavigateRepository = rep => {
    const { navigation } = this.props;

    navigation.navigate('Repository', { rep });
  };

  async load() {
    try {
      const { page, stars } = this.state;
      await this.setState({ loading: true });
      const { navigation } = this.props;

      const user = navigation.getParam('user');

      const response = await api.get(`/users/${user.login}/starred`, {
        params: {
          page,
          per_page: 5,
        },
      });

      await this.setState({
        stars: [...stars, ...response.data],
      });
    } catch (err) {
      console.tron.log('Erro na requisição', err);
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const { navigation } = this.props;
    const { stars, loading } = this.state;

    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading && <ActivityIndicator />}
        <Stars
          onRefresh={this.refreshList}
          refreshing={loading}
          onEndReachedThreshold={0.2}
          onEndReached={this.loadMore}
          data={stars}
          keyExtractor={star => String(star.id)}
          renderItem={({ item }) => (
            <Starred onPress={() => this.handleNavigateRepository(item)}>
              <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
              <Info>
                <Title>{item.name}</Title>
                <Author>{item.owner.login}</Author>
              </Info>
            </Starred>
          )}
        />
      </Container>
    );
  }
}
