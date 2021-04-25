import React, { Component } from 'react';
import Plot from 'react-plotly.js';

class ClosedTradeRow extends Component {
  formatPct = (number) => {
    // Format percent to allow it to fit within the space of the div containing it.
    const sign = number < 0 ? "" : "+";
    const formattedPct = sign+number.toFixed(2).toString()+"%";
    return formattedPct
  }

    render() {
        return (
            <div id="ct-list-row" onClick={() => this.props.handleClick(this.props.tradeId)}>
                <p id="ct-ticker">{this.props.ticker}</p>
                <p className="trade-qty">
                <svg className="trade-qty-icon" viewBox="-21 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m325.332031 512h-266.664062c-32.363281 0-58.667969-26.304688-58.667969-58.667969v-288c0-32.363281 26.304688-58.664062 58.667969-58.664062h10.664062c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16h-10.664062c-14.699219 0-26.667969 11.964843-26.667969 26.664062v288c0 14.699219 11.96875 26.667969 26.667969 26.667969h266.664062c14.699219 0 26.667969-11.96875 26.667969-26.667969v-10.664062c0-8.832031 7.167969-16 16-16s16 7.167969 16 16v10.664062c0 32.363281-26.304688 58.667969-58.667969 58.667969zm0 0"/><path d="m410.667969 384h-224c-32.363281 0-58.667969-26.304688-58.667969-58.667969v-266.664062c0-32.363281 26.304688-58.667969 58.667969-58.667969h224c32.363281 0 58.664062 26.304688 58.664062 58.667969v266.664062c0 32.363281-26.300781 58.667969-58.664062 58.667969zm-224-352c-14.699219 0-26.667969 11.96875-26.667969 26.667969v266.664062c0 14.699219 11.96875 26.667969 26.667969 26.667969h224c14.699219 0 26.664062-11.96875 26.664062-26.667969v-266.664062c0-14.699219-11.964843-26.667969-26.664062-26.667969zm0 0"/></svg>
                    {this.props.tradeQty}
                </p>
                <p id="ct-profit-loss-pct" style={{color: this.props.profitLossPct >= 0 ? "green" : "rgb(211, 63, 73)"}}>{this.formatPct(this.props.profitLossPct)}</p>
                <p id="ct-profit-loss-value">{this.props.profitLossVal}</p>
                <div id="ct-figure">
                  <Plot data={this.props.figData} layout={this.props.figLayout} config={{'staticPlot': true}} />
                </div>
            </div>
        )
      }
}

export default ClosedTradeRow;