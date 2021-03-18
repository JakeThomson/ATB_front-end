import React, { Component } from 'react';
import '../css/trade-stats.css';

export const Statistic = ({label, data}) => (
  <div id="stats-box" className="text-center" style={{maxWidth: "60px"}}>
    <p style={{minHeight: "23px", fontWeight: "600", fontSize: "16px", margin: 0}}>{data}</p>
    <p id="stat-label" className="text-wrap">{label}</p>
  </div>
)

class TradeStats extends Component {
  state = {
    focus: "monthly"
  }

  handleClick = (focus) => {
    this.setState({
      focus
    });
  }

  formatPct = (number) => {
    // Format percent to allow it to fit within the space of the div containing it.
    if(number === undefined || number === null) {
      return undefined
    }

    const decimalPts = number >= 10 ? 1 : 2 

    const formattedPct = number.toFixed(decimalPts).toString()+"%";
    return formattedPct
  }

  render() { 
    return (
      <div>
        <p id="trade-stats-header">Trade stats</p>
        <div id="stats-container" className="d-flex flex-wrap justify-content-between" >
          <Statistic label="Highest profit" data={(this.formatPct(this.props.stats.highestProfitTrade?.profitLossPct ?? 0))} />
          <Statistic label="Highest loss" data={(this.formatPct(this.props.stats.highestLossTrade?.profitLossPct ?? 0))} />
          <Statistic label="Profit factor" data={(this.props.stats.profitFactor?.toFixed(2) ?? "0.00")} />
          <Statistic label="Avg return" data={(this.formatPct(this.props.stats.avgProfitLossPct ?? 0))}/>
          <Statistic label="Avg profit" data={(this.formatPct(this.props.stats.avgProfitPct ?? 0))} />
          <Statistic label="Avg loss" data={(this.formatPct(this.props.stats.avgLossPct ?? 0))} />
        </div>
      </div>
    )
  }
}

export default TradeStats;