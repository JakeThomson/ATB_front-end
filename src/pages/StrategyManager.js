import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import '../css/strategy-manager/strategy-manager.css';
import SavedStrategies from '../components/strategy-manager/SavedStrategies.react';
import StrategyInfo from '../components/strategy-manager/StrategyInfo.react';
import {ReactComponent as BackSVG} from '../images/back.svg';
import moment from 'moment';

class StrategyManager extends Component {

  constructor(props) {
    super(props);
    let serverURL = "";
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      serverURL = 'http://127.0.0.1:8080';
    } else {
      serverURL = 'https://trading-api.jake-t.codes';
    }
    this.state = {
      server: serverURL,
      selected: undefined,
      savedStrategyData: undefined,
      availableModules: []
    }
  }

  componentDidMount() {
    // Fill UI with data from database.
    fetch(`${this.state.server}/strategies`, {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      let selected = undefined;

      if(this.props.location.state !== undefined) {
        const { strategyId } = this.props.location.state;
        selected = data.find(strategy => {return strategy.strategyId === strategyId});
      }

      data.forEach((strategy, i) => {
        strategy.backtests.forEach((backtest, j) => {
          backtest.datetimeFinished = moment(backtest.datetimeFinished);
          backtest.datetimeStarted = moment(backtest.datetimeStarted);
        })
      })

      this.setState({ 
        savedStrategyData: data,
        selected
      })
    });

    // Fill UI with data from database.
    fetch(`${this.state.server}/strategies/modules`, {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      this.setState({ 
        availableModules: Object.keys(data)
      })
    });
  }

  handleSelected = (selected) => {
    this.setState({
      selected,
    });
  }

  onStartBacktestClick = (strategyId) => {
    // When restart button is clicked, emit restart socket event.
    fetch(this.state.server + "/backtest_settings/strategy", {
      method: 'PUT',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({"strategyId": strategyId}),
    })
    .then(() => {
      this.props.history.push('/');
      this.props.socket.emit("restart");
    })
    .catch(err => {
      console.error(err)
    });
  }

  onDeleteBacktestClick = (strategyId) => {

    // When restart button is clicked, emit restart socket event.
    fetch(this.state.server + "/strategies/" + strategyId, {
      method: 'DELETE',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
    })
    .then(() => {
      const savedStrategyData = this.state.savedStrategyData.filter((strategy) => {
        return strategy.strategyId !== strategyId;
      });
      this.setState({savedStrategyData, selected: undefined});
    })
    .catch(err => {
      console.error(err)
    });
  }

  render() {
    return (
      <div id="wrapper">
       <Link to="/" id="strategy-manager-back-btn-container" onMouseDown={e => e.preventDefault()}>
          <BackSVG id="back-btn-icon" />
        </Link>
        <div id="page-name-container" style={{fontSize: "2rem"}}>
          <h2 className="strategy-editor-header ml-4 text-nowrap overflow-hidden" style={{marginTop:".4rem", maxWidth:"86%"}} >Strategy Manager</h2>
        </div>
        <SavedStrategies savedStrategyData={this.state.savedStrategyData} selected={this.state.selected} handleSelected={this.handleSelected} availableModules={this.state.availableModules}/>
        <StrategyInfo selected={this.state.selected} onStartBacktestClick={this.onStartBacktestClick} onDeleteBacktestClick={this.onDeleteBacktestClick} availableModules={this.state.availableModules}/>
        <div className="background">
          <div id="bg-square-1"/>
          <div id="bg-square-2"/>
          <div id="bg-square-3"/>
          <div id="bg-square-4"/>
        </div>
      </div>
    );
  }
}

export default withRouter(StrategyManager);
