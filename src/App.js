import React, { Component } from 'react';
import './css/App.css';
import './bootstrap.min.css';
import OpenTradeList from './components/OpenTradeList.js';
import CtList from './components/CtList.react.js';
import TotalProfit from './components/TotalProfit.react.js';
import OpenTradeStats from './components/OpenTradeStats.react.js';
import SuccessRate from './components/SuccessRate.react.js';
import WorldFlow from './components/WorldFlow.react.js';
import News from './components/News.react.js';
import TradeStats from './components/TradeStats.react';
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
        backtestDate: '',
        availableBalance: '',
        openTrades: []
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
      .then(data => this.setState({ backtestDate: data.backtestDate, availableBalance: this.formatCurrency(data.availableBalance)}));
    
    fetch(`${this.state.server}/trades`, {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => this.setState({openTrades: data}))

  }

  setupSocketListeners() {
    if(this.socket !== undefined) {
      console.log("Setting up socketlisteners");

      // Listen for updates to the backtest date.
      this.socket.on('backtestPropertiesUpdated', (data) => {

        const availableBalance = this.formatCurrency(data.availableBalance),
              backtestDate = data.backtestDate;

        this.setState({
          backtestDate: backtestDate || this.state.backtestDate,
          availableBalance: availableBalance || this.state.availableBalance,
        });
      });

      // Listen for updates to the backtest date.
      this.socket.on('tradesUpdated', (data) => {
        // Fill UI with data from database.
        fetch(`${this.state.server}/trades`, {
          headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
        .then(response => response.json())
        .then(data => this.setState({openTrades: data}))
      });
    }
  }

  formatCurrency = (number) => {
    if(number === undefined) {
      return undefined
    }

    var maximumFractionDigits = null
    if(number >= 1000) {
      maximumFractionDigits = 0
    } else {
      maximumFractionDigits = 2
    }

    var letter = "";
    if(number >= 100000) { 
      if(number>=1000000) {
        number = Math.round(number/1000)/1000
        maximumFractionDigits = 2
        letter = "M";
      } else {
        letter = "K";
        number = Math.round(number/100)/10
        maximumFractionDigits = 1
      }
    }

    var formatter = new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: maximumFractionDigits,
    });
    const formatted_number = formatter.format(number);
    
    return formatted_number+letter
  }
  

  render() {
    return (
      <div id="wrapper">
        <div id="content">
          <WorldFlow playpause="play" date={this.state.backtestDate} />
          <OpenTradeStats openTrades={this.state.openTrades} />
          <OpenTradeList openTrades={this.state.openTrades}/>
          <CtList/>
          <News/>
          <div id="trade-stats-container">
            <TradeStats/>
            <TotalProfit totalValue={this.state.availableBalance} totalPct="(+34.4%)" figure="" />
            <SuccessRate pct="68%" />
          </div>
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
