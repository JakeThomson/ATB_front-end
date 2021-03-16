import React, { Component } from 'react';
import {ReactComponent as PlayPause} from '../images/pause.svg';
import '../css/world-flow.css';

class WorldFlow extends Component {
    render() {
        return (
            <div id="date-container" className="d-flex flex-row justify-content-between">
                <button id="play-pause-btn" className="px-2 pl-3" onClick={this.props.playPauseClicked}>
                    <PlayPause id={this.props.isPaused ? "pause" : "play"} className="playPause" />
                </button>
                <p id="date" className="px-2 pr-3">{this.props.date}</p>
            </div>
        )
      }
}

export default WorldFlow;