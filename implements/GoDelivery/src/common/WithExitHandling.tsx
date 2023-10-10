import React, { Component } from 'react';
import { Alert, BackHandler } from 'react-native';

const withExitHandling = (WrappedComponent) => {
  class ExitHandlingHOC extends Component {
    componentDidMount() {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
      Alert.alert("GoDelivery", "test message");
      return true;
    };

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return ExitHandlingHOC;
};

export default withExitHandling;