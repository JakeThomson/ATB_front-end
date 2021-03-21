import React, { Component } from 'react';
import moment from 'moment';
import './css/App.css';
import './bootstrap.min.css';
import blankProfitLossGraph from './content/blankProfitLossGraph.json'
import OpenTradeList from './components/OpenTradeList.js';
import ClosedTradeList from './components/ClosedTradeList.react.js';
import TotalProfit from './components/TotalProfit.react.js';
import OpenTradeStats from './components/OpenTradeStats.react.js';
import SuccessRate from './components/SuccessRate.react.js';
import WorldFlow from './components/WorldFlow.react.js';
import News from './components/News.react.js';
import TradeStats from './components/TradeStats.react.js';
import Settings from './components/Settings.react.js'
import socketClient  from "socket.io-client";

class App extends Component {
  constructor(props) {
    super(props);

    // Detect environment application is running on and choose API URL appropricately.
    let serverURL = "";
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      serverURL = 'http://127.0.0.1:8080';
    } else {
      serverURL = 'https://trading-api.jake-t.codes';
    }

    this.state = {
        server: serverURL,
        isPaused: false,
        startDate: '',
        backtestDate: '',
        availableBalance: '',
        totalBalance: '',
        totalProfitLoss: '',
        totalProfitLossPct: '',
        totalProfitLossGraph: blankProfitLossGraph,
        successRate: '',
        openTrades: [],
        closedTrades: [],
        backtestOnline: true,
        tradeStats: {},
        settings: {
          startDate: moment("2015-01-01"),
          endDate: moment().startOf('day'),
          startBalance: 15000,
          marketIndex: "s&p500",
          capPct: 25,
          takeProfit: 1.02,
          stopLoss: 0.99
        }
    }
  }

  componentDidMount() {
    // Set up socket connection & listeners.
    this.socket = socketClient(this.state.server);
    
    this.setupSocketListeners();

    // Fill UI with data from database.
    fetch(`${this.state.server}/backtest_properties`, {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ 
        backtestDate: data.backtestDate, 
        startDate: data.startDate,
        totalProfitLoss: data.totalProfitLoss,
        totalProfitLossPct: this.formatPct(data.totalProfitLossPct),
        totalProfitLossGraph: JSON.parse(JSON.parse(data.totalProfitLossGraph)),
        totalBalance: data.totalBalance, 
        availableBalance: data.availableBalance,
        successRate: data.successRate || 0,
        isPaused: data.isPaused,
        backtestOnline: data.backtestOnline
      })});
    
    fetch(`${this.state.server}/trades`, {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => this.setState({openTrades: data[0], closedTrades: data[1]}))

    fetch(`${this.state.server}/trades/stats?date=${this.state.startDate}`, {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => this.setState({tradeStats: data}));
  }

  setupSocketListeners() {
    if(this.socket !== undefined) {

      // Listen for updates to the backtest date.
      this.socket.on('backtestPropertiesUpdated', (data) => {
        const availableBalance = data.availableBalance,
              totalProfitLoss = data.totalProfitLoss,
              totalProfitLossPct = this.formatPct(data.totalProfitLossPct),
              totalProfitLossGraph = data.totalProfitLossGraph !== undefined ? JSON.parse(data.totalProfitLossGraph) : undefined,
              totalBalance = data.totalBalance,
              backtestDate = data.backtestDate,
              successRate = data.successRate,
              isPaused = data.isPaused,
              backtestOnline = data.backtestOnline,
              tradeStats = data.tradeStats;
        
        // Only update the state of properties that were included in the socket payload.
        this.setState({
          backtestDate: backtestDate ?? this.state.backtestDate,
          totalProfitLoss: totalProfitLoss ?? this.state.totalProfitLoss,
          totalProfitLossPct: totalProfitLossPct ?? this.state.totalProfitLossPct,
          totalProfitLossGraph: totalProfitLossGraph ?? this.state.totalProfitLossGraph,
          availableBalance: availableBalance ?? this.state.availableBalance,
          totalBalance: totalBalance ?? this.state.totalBalance,
          successRate: successRate ?? this.state.successRate,
          isPaused: isPaused ?? this.state.isPaused,
          backtestOnline: backtestOnline ?? this.state.backtestOnline,
          tradeStats: tradeStats ?? this.state.tradeStats
        });
      });

      // Listen for updates to the backtest date.
      this.socket.on('tradesUpdated', (data) => {
        // Grab all open and closed trades from database.
        fetch(`${this.state.server}/trades`, {
          headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
        .then(response => response.json())
        .then(data => this.setState({openTrades: data[0], closedTrades: data[1]}))
      });

      // Listen for updates to the backtest date.
      this.socket.on('updateStats', (data) => {
        // Grab all open and closed trades from database.
        fetch(`${this.state.server}/trades/stats?date=${this.state.startDate}`, {
          headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
        .then(response => response.json())
        .then(data => this.setState({tradeStats: data ?? this.state.tradeStats}));
      });
    }
  }

  formatPct = (number) => {
    // Format percent to allow it to fit within the space of the div containing it.
    if(number === undefined) {
      return undefined
    }

    const decimalPts = number >= 10 ? 1 : 2 

    const sign = number < 0 ? "" : "+";
    const formattedPct = "("+sign+number.toFixed(decimalPts).toString()+"%)";
    return formattedPct
  }

  togglePlayPause = () => {
    // Update the pause state in the backtest when playpause button is clicked.
    const currentlyIsPaused = this.state.isPaused

    this.setState({ isPaused: !currentlyIsPaused });

    const data = { isPaused: !currentlyIsPaused }

    // Patch request to update database
    fetch(this.state.server + "/backtest_properties/is_paused", {
      method: 'PATCH',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(res => res.json())
    .catch(err => console.error(err))
  }

  handleSubmitSettings = (data) => {
    this.setState({ settings: data });
  }

  render() {
    return (
      <div id="wrapper">
        <div id="content">
          <WorldFlow isPaused={this.state.isPaused} date={this.state.backtestDate} playPauseClicked={this.togglePlayPause} backtestOnline={this.state.backtestOnline}/>
          <OpenTradeStats openTrades={this.state.openTrades} />
          <OpenTradeList openTrades={this.state.openTrades}/>
          <ClosedTradeList closedTrades={this.state.closedTrades}/>
          <News />
          <div id="trade-stats-container">
            <TradeStats backtestDate={this.state.backtestDate} stats={this.state.tradeStats} />
            <TotalProfit totalValue={this.state.totalBalance} totalProfitLoss={this.state.totalProfitLoss} totalPct={this.state.totalProfitLossPct} figure={this.state.totalProfitLossGraph} />
            <SuccessRate pct={this.state.successRate} />
          </div>
          <Settings socket={this.socket} onSubmitSettings={this.handleSubmitSettings} savedSettings={this.state.settings} />
        </div>
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

export default App;
