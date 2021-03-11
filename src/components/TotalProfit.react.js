import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import '../css/total-profit.css';

class TotalProfit extends Component {
    render() {
        return (
            <div id="total-profit-container">
                <p id="total-profit-loss-header">Total balance</p>
                <p id="total-profit-loss-value">{this.props.totalValue}</p>
                <p id="total-profit-loss-pct">{this.props.totalPct}</p>
                <div id="total-profit-loss-graph">
                  <Plot data={this.props.figure.data} layout={this.props.figure.layout} config={{'staticPlot': true}} /> 
                </div>
            </div>
        )
      }
}

export default TotalProfit;