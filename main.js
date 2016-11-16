import Exponent from 'exponent';
import React from 'react';
import { Alert, PanResponder } from 'react-native';

import Assets from './Assets';
// import Game from './3DGame';
import Game from './2DGame';


//// App

// This is the root component of the app. It does any loading required
// then renders `Game`.

class App extends React.Component {
  state = {
    loaded: false,
  }

  componentWillMount() {
    // THREE warns about unavailable WebGL extensions.
    console.disableYellowBox = true;

    this.load();
  }

  // Do stuff that needs to be done before first render of scene.
  async load() {
    try {
      // Load assets
      await Promise.all(Object.keys(Assets).map((name) =>
        Assets[name].downloadAsync()));

      // We're good to go!
      this.setState({ loaded: true });
    } catch (e) {
      Alert.alert('Error when loading', e.message);
    }
  }

  render() {
    return this.state.loaded ? (
      <Game style={{ flex: 1 }} />
    ) : (
      <Exponent.Components.AppLoading />
    );
  }
}

Exponent.registerRootComponent(App);
