import React, { Component } from 'react';
import moment from 'moment';
import blankProfitLossGraph from '../content/blankProfitLossGraph.json'
import OpenTradeList from '../components/dashboard/OpenTradeList.js';
import ClosedTradeList from '../components/dashboard/ClosedTradeList.react.js';
import TotalProfit from '../components/dashboard/TotalProfit.react.js';
import OpenTradeStats from '../components/dashboard/OpenTradeStats.react.js';
import SuccessRate from '../components/dashboard/SuccessRate.react.js';
import WorldFlow from '../components/dashboard/WorldFlow.react.js';
// import News from '../components/dashboard/News.react.js';
import TradeStats from '../components/dashboard/TradeStats.react.js';
import Settings from '../components/dashboard/Settings.react.js';
import TradeModal from '../components/dashboard/TradeViewModal.react';

class Dashboard extends Component {
  _isMounted = false;

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
        backtestId: 0,
        showTradeModal: false,
        tradeModalFocusId: undefined,
        settings: {
          startDate: moment("2015-01-01"),
          endDate: moment().startOf('day'),
          startBalance: 0,
          marketIndex: '',
          capPct: 0,
          takeProfit: 0,
          stopLoss: 0
        }
    }
  }

  componentDidMount() {
    this._isMounted = true;

    this.setupSocketListeners();

    // Fill UI with data from database.
    fetch(`${this.state.server}/backtests`, {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      this.setState({
        backtestId: data.backtestId,
        backtestDate: data.backtestDate, 
        totalProfitLoss: data.totalProfitLoss,
        totalProfitLossPct: this.formatPct(data.totalProfitLossPct),
        totalProfitLossGraph: JSON.parse(JSON.parse(data.totalProfitLossGraph)),
        totalBalance: data.totalBalance, 
        availableBalance: data.availableBalance,
        successRate: data.successRate || 0,
        startDate: data.startDate
      })
    })
    .then(() => {
      fetch(`${this.state.server}/trades/${this.state.backtestId}`, {
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        if(this._isMounted) {
          this.setState({openTrades: data[0], closedTrades: data[1]});
        }
      });

      fetch(`${this.state.server}/trades/${this.state.backtestId}/stats?date=${this.state.startDate}`, {
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        if(this._isMounted) {
          this.setState({tradeStats: data});
        }
      });

      fetch(`${this.state.server}/backtest_settings/available`, {
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        if(this._isMounted) {
          this.setState({backtestOnline: data.backtestOnline});
        }
      });
    });
  }

  setupSocketListeners() {
    if(this.props.socket !== undefined) {

      // Listen for updates to the backtest date.
      this.props.socket.on('backtestUpdated', (data) => {
        const availableBalance = data.availableBalance,
              totalProfitLoss = data.totalProfitLoss,
              totalProfitLossPct = this.formatPct(data.totalProfitLossPct),
              totalProfitLossGraph = data.totalProfitLossGraph !== undefined ? JSON.parse(data.totalProfitLossGraph) : undefined,
              totalBalance = data.totalBalance,
              backtestDate = data.backtestDate,
              successRate = data.successRate,
              isPaused = data.isPaused,
              backtestOnline = data.backtestOnline,
              backtestId = data.backtestId,
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
          backtestId: backtestId ?? this.state.backtestId,
          tradeStats: tradeStats ?? this.state.tradeStats
        });
      });

      // Listen for updates to the backtest date.
      this.props.socket.on('tradesUpdated', (data) => {
        // Grab all open and closed trades from database.
        fetch(`${this.state.server}/trades/${this.state.backtestId}`, {
          headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
        .then(response => response.json())
        .then(data => {
          if(this._isMounted) {
            this.setState({openTrades: data[0], closedTrades: data[1]})
          }
        })
      });

      // Listen for updates to the backtest date.
      this.props.socket.on('updateStats', (data) => {
        // Grab all open and closed trades from database.
        fetch(`${this.state.server}/trades/${this.state.backtestId}/stats?date=${this.state.startDate}`, {
          headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
        .then(response => response.json())
        .then(data => {
          if(this._isMounted) {
            this.setState({tradeStats: data ?? this.state.tradeStats})
          }
        });
      });
    }
  }

  formatPct = (number) => {
    // Format percent to allow it to fit within the space of the div containing it.
    if(number === undefined) {
      return undefined
    }

    const decimalPts = Math.abs(number) >= 10 ? 1 : 2 

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
    fetch(this.state.server + "/backtest_settings/is_paused", {
      method: 'PATCH',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(res => res.json())
    .catch(err => console.error(err));
  }

  handleSettingsSaved = (data) => {
    this.setState({ settings: data });
  }

  handleGetSettings = (data) => {
    this.setState({
      settings: {
        startDate: moment(data.startDate), 
        endDate: moment(data.endDate),
        startBalance: data.startBalance,
        marketIndex: data.marketIndex,
        capPct: data.capPct,
        takeProfit: data.takeProfit,
        stopLoss: data.stopLoss,
        backtestOnline: data.backtestOnline
      },
      isPaused: data.isPaused
     });
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.props.socket.off("tradesUpdated");
    this.props.socket.off("updateStats");
  }
  
  setShowTradeModal = (bool, tradeId) => {
    // Sets the visible state of the modal.
    this.setState({ showTradeModal: bool, tradeModalFocus: tradeId});
  }  

  render() {
    const handleCloseTradeModal = () => this.setShowTradeModal(false, undefined);
    const handleShowTradeModal = (tradeId) => this.setShowTradeModal(true, tradeId);
    return (
      <div id="wrapper">
        <div id="content">
          <WorldFlow isPaused={this.state.isPaused} date={this.state.backtestDate} playPauseClicked={this.togglePlayPause} backtestOnline={this.state.backtestOnline}/>
          <OpenTradeStats openTrades={this.state.openTrades} />
          <OpenTradeList openTrades={this.state.openTrades} handleShow={handleShowTradeModal}/>
          <ClosedTradeList closedTrades={this.state.closedTrades} handleShow={tradeId => handleShowTradeModal(tradeId)}/>
          {/* <News /> */}
          <div id="trade-stats-container">
            <TradeStats backtestDate={this.state.backtestDate} stats={this.state.tradeStats} />
            <TotalProfit totalValue={this.state.totalBalance} totalProfitLoss={this.state.totalProfitLoss} totalPct={this.state.totalProfitLossPct} figure={this.state.totalProfitLossGraph} />
            <SuccessRate pct={this.state.successRate} />
          </div>
          <Settings backtestOnline={this.state.backtestOnline} socket={this.props.socket} onSettingsSaved={this.handleSettingsSaved} onGetSettings={this.handleGetSettings} savedSettings={this.state.settings} />
          {
            this.state.showTradeModal ?
              <TradeModal show={this.state.showTradeModal} selectedTradeId={this.state.tradeModalFocus} openTrades={this.state.openTrades} closedTrades={this.state.closedTrades} handleClose={handleCloseTradeModal}/>
            : null
          }
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

export default Dashboard;
