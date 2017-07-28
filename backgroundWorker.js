import React, {Component} from "react";
import {AppState, Text} from "react-native";

class BackgroundWorker extends Component {

  state = {
    appState: AppState.currentState
  }

  componentDidMount() {
    AppState.addEventListener("change", this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === "active") {
      console.log("App has come to the foreground!");
    } else if (this.state.appState.match(/active/) && (nextAppState === "inactive" || nextAppState === "background")) {
      console.log("App has gone to the background!");
    }
    this.setState({appState: nextAppState});
  }

  render() {
    return (
      <Text>Current state is: {this.state.appState}</Text>
    );
  }

}

export default BackgroundWorker;