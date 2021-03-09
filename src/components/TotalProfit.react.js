import React, { Component } from 'react';
import '../css/total-profit.css';

class TotalProfit extends Component {
    render() {
        return (
            <div id="total-profit-container">
                <p id="total-profit-loss-header">Total profit/loss</p>
                <p id="total-profit-loss-value">{this.props.totalValue}</p>
                <p id="total-profit-loss-pct">{this.props.totalPct}</p>
                <div id="total-profit-loss-graph">{this.props.figure}</div>
            </div>
        )
      }
}

export default TotalProfit;