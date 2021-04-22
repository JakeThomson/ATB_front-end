import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import StrategyEditor from './pages/StrategyEditor';
import socketClient from 'socket.io-client';

class Main extends React.Component {  
  constructor(props) {
    super(props);

    // Detect environment application is running on and choose API URL appropriately.
    let serverURL = "";
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      serverURL = 'http://127.0.0.1:8080';
    } else {
      serverURL = 'https://trading-api.jake-t.codes';
    }

    this.state = {
      server: serverURL,
      socket: socketClient(serverURL)
    }
  }

  render() {
  return (
    <Switch> {/* The Switch decides which component to show based on the current URL.*/}
        <Route exact path='/' render={(props) => (
          <Dashboard {...props} socket={this.state.socket} />
        )}></Route>
        <Route exact path='/strategy-editor' render={(props) => (
          <StrategyEditor {...props} socket={this.state.socket} />
        )} ></Route>
    </Switch>
  );
  }
}

export default Main;