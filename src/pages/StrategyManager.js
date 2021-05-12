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

  /**
   * When component mounts, set up socket listeners and get list of strategies from database.
   */
  componentDidMount() {
    
    this.setupSocketListeners();

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

      // If visiting page from strategyEditor view, then automatically focus on the last edited strategy.
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

  /**
   * Sets up socket listeners from the data access API, enables real-time updates on the backtest.
   */
  setupSocketListeners() {
    if(this.props.socket !== undefined) {

      // Listen for updates to the backtest date.
      this.props.socket.on('backtestUpdated', (data) => {
        const totalProfitLossPct = data.totalProfitLossPct,
              totalProfitLossGraph = data.totalProfitLossGraph !== undefined ? JSON.parse(data.totalProfitLossGraph) : undefined,
              successRate = data.successRate,
              backtestId = data.backtestId;

        if(totalProfitLossGraph !== undefined && successRate !== undefined && backtestId !== undefined && this.state.selected !== undefined) {
          if(this.state.selected.active === true) {
            this.setState(prevState => ({
              selected: {
                  ...prevState.selected,
                  backtests: prevState.selected.backtests.map(
                    el => el?.active === 1 ? { ...el, totalProfitLossGraph, successRate, backtestId, totalProfitLossPct }: el
                  )
              },
              savedStrategyData: prevState.savedStrategyData.map(
                strategy => strategy?.strategyId === prevState.selected.strategyId ? { ...strategy, backtests: prevState.selected.backtests.map(
                  backtest => backtest?.active === 1 ? { ...backtest, totalProfitLossGraph, successRate, backtestId, totalProfitLossPct }: backtest
                ) }: strategy
              )
            }))
          }
        }
      });
    }
  }

  /**
   * When strategy is clicked, set it as the focus.
   * @param {Object} selected 
   */
  handleSelected = (selected) => {
    this.setState({
      selected,
    });
  }

  /**
   * When start/restart backtest button is clicked, then start a new backtest in the backtesting platform and redirect to the dashboard view.
   * @param {int} strategyId - ID of the strategy to start.
   */
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

  /**
   * When delete button is clicked, remove the strategy from the database and strategy list.
   * @param {int} strategyId - ID of the strategy to delete.
   */
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
        <StrategyInfo selected={this.state.selected} onStartBacktestClick={this.onStartBacktestClick} onDeleteBacktestClick={this.onDeleteBacktestClick} availableModules={this.state.availableModules} socket={this.props.socket} />
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
