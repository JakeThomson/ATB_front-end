import React, { Component } from 'react';
import CtRow from './CtRow.react.js';
import '../css/ct-list.css';

class CtList extends Component {
    render() {
        return (
            <div id="ct-container">
            <p id="ct-header">Closed trades</p>
                <div id="ct-list-container">
                    {/* <CtRow 
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

export default CtList;