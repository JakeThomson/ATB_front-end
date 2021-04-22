import React, { Component } from 'react';
import '../css/strategy-manager/strategy-manager.css';
import SavedStrategies from '../components/strategy-manager/SavedStrategies.react';
import StrategyHistory from '../components/strategy-manager/StrategyHistory.react';

class StrategyManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: undefined,
      savedStrategyData: [{"name": "Strategy 1", "lastRun": "1 min ago", "active": true, "avgSuccess": 45}, {"name": "Test Strategy", "lastRun": "12m ago", "avgSuccess":0}]
    }
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
        <StrategyHistory />
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
