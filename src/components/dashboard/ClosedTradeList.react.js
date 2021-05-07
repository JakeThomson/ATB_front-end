import React, { Component } from 'react';
import ClosedTradeRow from './ClosedTradeRow.react.js';
import '../../css/dashboard/ct-list.css';

class ClosedTradeList extends Component {

  /**
   * Format currency to allow it to be shown within the space of the div containing it.
   * @param {int} number - The value of money to be formatted.
   * @param {bool} isProfit - Determines if the returned value needs to have a + if its positive.
   * @returns {String} - The formatted string.
   */
  formatCurrency = (number, isProfit) => {
    var sign = "";

    // Start string with '+' if positive, negative ints automatically have '-'.
    // Only do if the final string needs it. 
    if (isProfit) {
      sign = number < 0 ? "" : "+";
    }

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
    return sign+formatted_number+letter;
  }

  render() {
    return (
      <div id="ct-container">
      <p id="ct-header">Closed trades</p>
        <div id="ct-list-container">
          {this.props.closedTrades.map(({ tradeId, ticker, shareQty, investmentTotal, profitLoss, simpleFigure, profitLossPct }) => 
            <ClosedTradeRow 
              key={tradeId}
              tradeId={tradeId}
              ticker={ticker} 
              tradeQty={`${shareQty} (${this.formatCurrency(investmentTotal)})`}
              profitLossPct={profitLossPct}
              profitLossVal={this.formatCurrency(profitLoss, true)} 
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

export default ClosedTradeList;