import React, { Component } from 'react';
import '../../css/strategy-editor/selections.css';


class AnalysisModuleTile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true
    }
  }
  render() {
    return (
      <div className="col-6 px-1">
        <div id="analysis-module-box" >
          <h5 className="strategy-editor-header">Moving<br/>Averages</h5>
        </div>
      </div>
    )
  }
}

export default AnalysisModuleTile;