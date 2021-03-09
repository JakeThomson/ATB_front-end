import React, { Component } from 'react';
import OtRow from './OtRow.react.js';
import '../css/at-list.css';


class OtList extends Component {
  formatTradeQty = (qty, total) => {
    return `${qty} (${this.formatCurrency(total)})`
  }

  formatCurrency = (number) => {
    if(number === undefined) {
      return undefined
    }

    var maximumFractionDigits = null
    var letter = "";
    if(number >= 1000) {
      number /= 1000;
      maximumFractionDigits = 1
      letter ="k";
    } else if(number >= 10000) {
      maximumFractionDigits = 0
      letter ="k";
    } else {
      maximumFractionDigits = 0
    }

    var formatter = new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: maximumFractionDigits,
    });
    const formatted_number = formatter.format(number);
    
    return formatted_number+letter
  }

  formatPct = (number) => {
    const sign = number < 0 ? "-" : "+";
    const formattedPct = sign+number.toFixed(2).toString()+"%";
    return formattedPct
  }

    render() {
        return (
          <div id="at-container">
            <p id="at-header">Active trades</p>
            <div id="at-list-container">
              {this.props.openTrades.map(({ ticker, shareQty, investmentTotal, currentPrice, figurePct }) => <OtRow 
                ticker={ticker} 
                tradeQty={this.formatTradeQty(shareQty, investmentTotal)}
                currentPrice={currentPrice.toFixed(2)}
                profitLossPct={this.formatPct(figurePct)}
              />)}
            </div>
          </div>
        )
    }
}

export default OtList;