import React, { Component } from 'react';
import '../../css/strategy-editor/selections.css';


class AnalysisModuleTile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: this.props.disabled(this.props.method)
    }
  }

  /**
   * Add the module to the strategy on tile click.
   */
  handleClick = () => {
    if(!this.state.disabled) {
      this.props.handleClick(this.props.method);
    }
  }

  render() {
    return (
      <div className="col-6 px-1" onClick={this.handleClick}>
        <div id="analysis-module-box" className={"row col-12 mx-auto" + (this.state.disabled ? " disabled" : "")} >
          <h5 className="strategy-editor-header m-auto">{this.props.method}</h5>
        </div>
      </div>
    )
  }
}

export default AnalysisModuleTile;