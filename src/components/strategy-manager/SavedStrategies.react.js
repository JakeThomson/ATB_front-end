import React, { Component } from "react";
import '../../css/strategy-manager/saved-strategies.css';
import {ReactComponent as CloseSVG} from '../../images/close.svg';
import { Link } from "react-router-dom";

export default class SavedStrategies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    }
  }

  render() {
    return (
      <div id="selections-container" className="container d-flex py-2 px-3">
        <h5 className="col-8 px-0 strategy-editor-header">Saved strategies</h5>
        <Link to="/strategy-editor" id="new-btn-container" onMouseDown={e => e.preventDefault()}>
          Create
          <CloseSVG id="new-btn-icon"/>
        </Link>
        <div id="selection-row-container">
          
        </div>
      </div>
    );
  }
}