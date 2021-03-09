import React, { Component } from 'react';
import '../css/at-stats.css';

class AtStats extends Component {

  formatCurrency = (number) => {
    if(number === undefined) {
      return undefined
    }

    var maximumFractionDigits = 0
    var letter = "";
    if(number >= 1000) {
      number /= 1000;
      maximumFractionDigits = 1
      letter ="k";
    } else if(number >= 10000) {
      maximumFractionDigits = 0
      letter ="k";
    } else {
      maximumFractionDigits = 2
    }

    var formatter = new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: maximumFractionDigits,
    });
    const formatted_number = formatter.format(number);
    
    return formatted_number+letter
  }

    render() {
      
      var numTrades = this.props.openTrades.length
      var totalValue = this.props.openTrades.reduce((a, b) => a + (b['investmentTotal'] || 0), 0);
        return (
            <div id="at-stats-container">
                <p id="at-stats-qty">{numTrades}</p>
                <p id="at-stats-text">active trades<br/>valued</p>
                <p id="at-stats-value">{this.formatCurrency(totalValue)}</p>
            </div>
        )
      }
}

export default AtStats;