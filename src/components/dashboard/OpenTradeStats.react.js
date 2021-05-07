import React, { Component } from 'react';
import '../../css/dashboard/ot-stats.css';

class AtStats extends Component {

  /**
   * Format currency to allow it to be shown within the space of the div containing it.
   * @param {int} number - The value of money to be formatted.
   * @returns {String} - The formatted string.
   */
  formatCurrency = (number) => {
    // Format currency to allow it to be shown within the space of the div containing it.
    if(number === undefined) {
      return undefined
    }

    // Shorten the number by replacing trailing 0's with their suffix.
    var maximumFractionDigits = null
    var letter = "";
    if(number >= 1000000) {
      number /= 1000000;
      maximumFractionDigits = 1
      letter ="m";
    } else if(number >= 100000) {
      number /= 1000;
      maximumFractionDigits = 0
      letter ="k";
    }else if(number >= 100000) {
      number /= 100000;
      maximumFractionDigits = 2
      letter ="k";
    } else if(number >= 10000) {
      number /= 1000;
      maximumFractionDigits = 1
      letter ="k";
    } else if(number >= 1000) {
      maximumFractionDigits = 0
    } else if(number >= 100) {
      maximumFractionDigits = 1
    } else {
      maximumFractionDigits = 2
    }

    // Format the value into a currency format.
    var formatter = new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: maximumFractionDigits,
    });
    const formatted_number = formatter.format(number);
    
    // Compose string to be returned.
    return formatted_number+letter
  }

  render() {
    var numTrades = this.props.openTrades.length
    // Get the total amount of money invested in all trades from the open trades array.
    var totalValue = this.props.openTrades.reduce((a, b) => a + (b['investmentTotal'] || 0), 0);

    return (
      <div id="ot-stats-container">
        <p id="ot-stats-qty">{numTrades}</p>
        <p id="ot-stats-text">active trades<br/>valued</p>
        <p id="ot-stats-value">{this.formatCurrency(totalValue)}</p>
      </div>
    )
  }
}

export default AtStats;