import React, { Component } from 'react';
import '../css/strategy-manager/strategy-manager.css';
import SavedStrategies from '../components/strategy-manager/SavedStrategies.react';
import StrategyHistory from '../components/strategy-manager/StrategyHistory.react';

class StrategyManager extends Component {
  help = [
    {
      "strategyName": "Strategy 1", 
      "technicalAnalysis": [{"name":"Moving Averages","config":{"longTermType":"SMA","shortTermType":"SMA","longTermDayPeriod":50,"shortTermDayPeriod":20}},{"name":"Bollinger Bands","config":{"dayPeriod":21}}],
      "lastRun": "1 min ago", 
      "active": true, 
      "avgSuccess": 45, 
      "avgReturns": 21
    }, 
    {
      "strategyName": "Test Strategy", 
      "technicalAnalysis": [{"name":"Moving Averages","config":{"longTermType":"SMA","shortTermType":"SMA","longTermDayPeriod":50,"shortTermDayPeriod":20}},{"name":"Bollinger Bands","config":{"dayPeriod":21}}], 
      "lastRun": "12m ago", 
      "active": false, 
      "avgSuccess": 25,
      "avgReturns": 21
    }]

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
      savedStrategyData: []
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
      this.setState({ 
        savedStrategyData: data
      })
    });
  }

  handleSelected = (selected) => {
    this.setState({
      selected,
    });
  }

  render() {
    return (
      <div id="wrapper">
        <div id="page-name-container" style={{fontSize: "2rem"}}>
          <h2 className="strategy-editor-header ml-4 text-nowrap overflow-hidden" style={{marginTop:".4rem", maxWidth:"86%"}} >Strategy Manager</h2>
        </div>
        <SavedStrategies savedStrategyData={this.state.savedStrategyData} selected={this.state.selected} handleSelected={this.handleSelected}/>
        <StrategyHistory selected={this.state.selected} />
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

export default StrategyManager;
