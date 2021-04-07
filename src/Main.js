import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import StrategyManager from './pages/StrategyManager'

class Main extends React.Component {  
  render() {
  return (
    <Switch> {/* The Switch decides which component to show based on the current URL.*/}
        <Route exact path='/' component={Dashboard}></Route>
        <Route exact path='/strategy-manager' component={StrategyManager} ></Route>
    </Switch>
  );
  }
}

export default Main;