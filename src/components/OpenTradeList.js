import React, { Component } from 'react';
import OpenTradeRow from './OpenTradeRow.react.js';
import '../css/ot-list.css';


class OpenTradeList extends Component {
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
      minimumFractionDigits: 0,
      maximumFractionDigits: maximumFractionDigits,
    });
    const formatted_number = formatter.format(number);
    
    return formatted_number+letter
  }

    render() {
        return (
          <div id="at-container">
            <p id="at-header">Open trades</p>
            <div id="ot-list-container">
              {this.props.openTrades.map(({ tradeId, ticker, shareQty, investmentTotal, currentPrice, figure, profitLossPct }) => 
                <OpenTradeRow 
                  key={tradeId}
                  ticker={ticker} 
                  tradeQty={this.formatTradeQty(shareQty, investmentTotal)}
                  currentPrice={currentPrice.toFixed(2)}
                  profitLossPct={profitLossPct}
                  figData={figure.data}
                  figLayout={figure.layout}
                />
              )}
            </div>
          </div>
        )
    }
}

export default OpenTradeList;