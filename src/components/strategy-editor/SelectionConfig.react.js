import React, { Component } from 'react';
import '../../css/strategy-editor/selection-config.css';


class SelectionConfig extends Component {
    render() {
        return (
            <div id="selection-config-container" className="container py-2 px-3">
              <h5 className="row col-12 strategy-editor-header">Configuration</h5>
              <div id="selection-config-editor-container">

              </div>
            </div>
        )
    }
}

export default SelectionConfig;