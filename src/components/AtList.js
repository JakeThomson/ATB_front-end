import React, { Component } from 'react';
// import AtRow from './AtRow.react.js';
import '../css/at-list.css';


class AtList extends Component {
    render() {
        return (
          <div id="at-container">
            <p id="at-header">Active trades</p>
            <div id="at-list-container">
              {/* <AtRow 
                ticker="AXP" 
                tradeQty="138 (£4.8k)" 
                currentPrice="1247.73"
                profitLossPct="+1.28%" 
              /> */}
            </div>
          </div>
        )
    }
}

export default AtList;