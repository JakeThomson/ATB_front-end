import React, { Component } from 'react';
import '../../css/dashboard/success-rate.css';

class SuccessRate extends Component {
  
  /**
  * Format percentage value to allow it to fit within the space of the div containing it.
  * @param {*} number - The percentage value to be formatted.
  * @returns {String} - The formatted percentage
  */
  formatPct = (number) => {
    if(number === '') {
      return '';
    }

    const decimalPts = number >= 10 ? 0 : 1
    const formattedPct = number.toFixed(decimalPts).toString()+"%";
    return formattedPct
  }
  
  render() {
    return (
      <div>
        <p id="success-rate-pct-header">Success rate</p>
        <p id="success-rate-pct">{this.formatPct(this.props.pct)}</p>
      </div>
    )
  }
}

export default SuccessRate;