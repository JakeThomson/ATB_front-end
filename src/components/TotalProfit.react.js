import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import {ReactComponent as SwapSVG} from '../images/swap.svg';
import '../css/total-profit.css';

class TotalProfit extends Component {
  state = {
    display: localStorage.getItem('viewTotalBalanceOrProfit') ?? "profit"
  }

  setInfo = (display) => {
    this.setState({display});
    localStorage.setItem('viewTotalBalanceOrProfit', display);
  }

  formatCurrency = (number) => {
    // Format currency to allow it to be shown within the space of the div containing it.
    if(number === undefined) {
      return undefined
    }

    var maximumFractionDigits = null
    if(Math.abs(number) >= 1000) {
      maximumFractionDigits = 0
    } else {
      maximumFractionDigits = 2
    }

    var letter = "";
    if(Math.abs(number) >= 100000) { 
      if(Math.abs(number)>=1000000) {
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
      minimumFractionDigits: maximumFractionDigits,
      maximumFractionDigits: maximumFractionDigits,
    });
    const formatted_number = formatter.format(number);
    
    return formatted_number+letter
  }

  render() {
    const handleClick = () => this.setInfo(this.state.display === "profit" ? "balance" : "profit");
    return (
      <div id="total-profit-container">
        <div className="d-flex">
        <p id="total-profit-loss-heaer">Total {this.state.display}</p>
          <button id="toggle-profit-balance-btn" onClick={handleClick}>
            <SwapSVG id="toggle-profit-balance-icon" />
          </button>
        </div>
        <p id="total-profit-loss-value">{this.formatCurrency(this.state.display === "balance" ? this.props.totalValue : this.props.totalProfitLoss)}</p>
        <p id="total-profit-loss-pct">{this.props.totalPct}</p>
        <div id="total-profit-loss-graph">
          <Plot data={this.props.figure.data} layout={this.props.figure.layout} config={{'staticPlot': true}} /> 
        </div>
      </div>
    )
  }
}

export default TotalProfit;