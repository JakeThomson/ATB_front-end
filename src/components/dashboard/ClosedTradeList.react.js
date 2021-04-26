import React, { Component } from 'react';
import ClosedTradeRow from './ClosedTradeRow.react.js';
import '../../css/dashboard/ct-list.css';

class ClosedTradeList extends Component {
  formatTradeQty = (qty, total) => {
    // Format trade qauntity show the number of trades bought, and their total value.
    return `${qty} (${this.formatCurrency(total)})`
  }

  formatCurrency = (number, isProfit) => {
    // Format currency to allow it to be shown within the space of the div containing it.
    var sign = "";

    if (isProfit) {
      sign = number < 0 ? "" : "+";
    }

    if(number === undefined) {
      return undefined
    }

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

    var formatter = new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: maximumFractionDigits,
    });
    const formatted_number = formatter.format(number);
    
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
                        tradeQty={this.formatTradeQty(shareQty, investmentTotal)}
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