import React, { Component } from 'react';
import {ReactComponent as PlayPause} from '../images/pause.svg';
import '../css/world-flow.css';

class WorldFlow extends Component {
  render() {
    return (
      <div id="date-container" className="d-flex flex-row justify-content-between">
        <button id="play-pause-btn" className="mx-2 ml-3 my-auto" onClick={this.props.playPauseClicked}>
          <PlayPause id={this.props.isPaused ? "pause" : "play"} className="playPause" />
        </button>
        <p id="date" className="px-2 pr-3">{this.props.date}</p>
        <div id="backtest-availability-box" className={"d-flex flex-row justify-content-center text-center " + (!this.props.backtestOnline ? "offline" : "")}>
          Backtesting system offline
        </div>
      </div>
    )
  }
}

export default WorldFlow;