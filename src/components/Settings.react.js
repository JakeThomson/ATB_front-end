import React, { Component } from 'react';
import {ReactComponent as SettingsSVG} from '../images/settings.svg';
import '../css/settings.css';

class News extends Component {
    render() {
        return (
            <div id="settings-container" className="d-flex flex-row justify-content-center">
              <button id="settings-btn" onClick={this.props.onRestart}>
                <SettingsSVG id="settings-icon"/>
              </button>
            </div>
        )
      }
}

export default News;