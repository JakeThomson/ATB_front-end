import React, { Component } from 'react';
import ClosedTradeRow from './ClosedTradeRow.react.js';
import '../css/ct-list.css';

class ClosedTradeList extends Component {
  formatTradeQty = (qty, total) => {
    return `${qty} (${this.formatCurrency(total)})`
  }

  formatCurrency = (number) => {
    const sign = number < 0 ? "" : "+";

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
      maximumFractionDigits = 2
    }

    var formatter = new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: maximumFractionDigits,
    });
    const formatted_number = formatter.format(number);
    
    return sign+formatted_number+letter
  }

    render() {
        return (
            <div id="ct-container">
            <p id="ct-header">Closed trades</p>
                <div id="ct-list-container">
                {this.props.closedTrades.map(({ tradeId, ticker, shareQty, investmentTotal, profitLoss, figure, profitLossPct }) => 
                  <ClosedTradeRow 
                    key={tradeId}
                    ticker={ticker} 
                    tradeQty={this.formatTradeQty(shareQty, investmentTotal)}
                    profitLossPct={profitLossPct}
                    profitLossVal={this.formatCurrency(profitLoss)} 
                    figData={figure.data}
                    figLayout={figure.layout}
                  />
                )}
                {/* <ClosedTradeRow 
                        ticker="AXPEDD" 
                        tradeQty="138 (£4.8k)" 
                        profitLossPct="+1.28%" 
                        profitLossVal="+£2,453" 
                    /> */}
                </div>
            </div>
        )
    }
}

export default ClosedTradeList;