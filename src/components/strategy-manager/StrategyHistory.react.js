import React, { Component } from 'react';
import '../../css/strategy-manager/strategy-history.css';
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

class SelectionConfig extends Component {

  render() {
    return (
      <div id="selection-config-container" className="container py-2 px-3">
        <h5 className="row col-12 strategy-editor-header">Strategy info</h5>
        <div id="strategy-info-container" className="py-1">
          {
            this.props.selected ?
              <div className="container row mx-auto px-0">
                <div className="px-0 mx-auto mb-2">
                  <Button className="restart-backtest-btn py-1" onMouseDown={e => e.preventDefault()} onClick={() => this.props.onStartBacktestClick(this.props.selected.strategyId)}>{this.props.selected.active ? "Restart" : "Start"} Backtest</Button>
                  <Link 
                    to={{
                        pathname: "/strategy-editor",
                        state: {...this.props.selected} 
                      }} 
                    className="mx-auto my-3" 
                    onMouseDown={e => e.preventDefault()} 
                  >
                    <Button className="edit-backtest-btn py-1 mx-3" >
                      Edit
                    </Button>
                  </Link>
                  <Button className="delete-backtest-btn py-1" onMouseDown={e => e.preventDefault()}>Delete</Button>
                </div>
                { 
                  this.props.selected.active ?
                    <div className="col-12 px-0 mb-1 text-center" style={{fontSize: "10pt"}}><i>Backtest has been running for 00:38:05</i></div>
                  : <div className="col-12 px-0 mb-1 text-center" style={{fontSize: "10pt"}}><i>Backtest last run {this.props.selected.lastRun}</i></div>
                }
                <div className="col-6 px-0 text-center">
                  <h2 className="mb-0">{this.props.selected.avgSuccess}%</h2>
                  <h6>Avg. success rate</h6>
                </div>
                <div className="col-6 px-0 text-center">
                  <h2 className="mb-0">+{this.props.selected.avgSuccess/2}%</h2>
                  <h6>Avg. returns</h6>
                </div>
              </div>
            : null
          }
        </div>
      </div>
    )
  }
}

export default SelectionConfig;