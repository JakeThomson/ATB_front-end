import React, { Component } from 'react';
import OpenTradeRow from './OpenTradeRow.react.js';
import '../../css/dashboard/ot-list.css';


class OpenTradeList extends Component {

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
    if(Math.abs(number) >= 1000000) {
      number /= 1000000;
      maximumFractionDigits = 2
      letter ="m";
    } else if(Math.abs(number) >= 100000) {
      number /= 1000;
      maximumFractionDigits = 0
      letter ="k";
    }else if(Math.abs(number) >= 100000) {
      number /= 100000;
      maximumFractionDigits = 2
      letter ="k";
    } else if(Math.abs(number) >= 10000) {
      number /= 1000;
      maximumFractionDigits = 1
      letter ="k";
    } else if(Math.abs(number) >= 1000) {
      maximumFractionDigits = 0
    } else if(Math.abs(number) >= 100) {
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
    return (
      <div id="at-container">
        <p id="at-header">Open trades</p>
        <div id="ot-list-container">
          {this.props.openTrades.map(({ tradeId, ticker, shareQty, investmentTotal, currentPrice, simpleFigure, profitLossPct }) => 
            <OpenTradeRow 
              key={tradeId}
                tradeId={tradeId}
              ticker={ticker} 
              tradeQty={`${shareQty} (${this.formatCurrency(investmentTotal)})`}
              currentPrice={currentPrice.toFixed(2)}
              profitLossPct={profitLossPct}
              figData={simpleFigure.data}
              figLayout={simpleFigure.layout}
              handleClick={this.props.handleShow}
            />
          )}
        </div>
      </div>
    )
  }
}

export default OpenTradeList;