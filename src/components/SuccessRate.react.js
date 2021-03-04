import React, { Component } from 'react';
import '../css/success-rate.css';

class SuccessRate extends Component {
    render() {
        return (
            <div>
                <p id="success-rate-pct-header">Success rate</p>
                {/* <p id="success-rate-pct">{this.props.pct}</p> */}
            </div>
        )
      }
}

export default SuccessRate;