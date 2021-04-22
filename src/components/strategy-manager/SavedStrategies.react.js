import React, { Component } from "react";
import '../../css/strategy-manager/saved-strategies.css';

export default class SavedStrategies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    }
  }

  render() {
    return (
      <div id="selections-container" className="container py-2 px-3">
        <h5 className="row col-12 strategy-editor-header">Saved strategies</h5>
        <div id="selection-row-container">
          
        </div>
      </div>
    );
  }
}