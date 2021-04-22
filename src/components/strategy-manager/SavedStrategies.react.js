import React, { Component } from "react";
import '../../css/strategy-manager/saved-strategies.css';
import {ReactComponent as CloseSVG} from '../../images/close.svg';
import { Link } from "react-router-dom";

class SelectionRow extends Component {

  handleStrategyClick = () => {
    this.props.handleStrategyClick(this.props.strategy);
  }

  handleDeleteClick = (e) => {
    e.stopPropagation();
    this.props.handleRemoveClick(this.props.strategy);
  }
  
  render() {
    return (
        <div
          onClick={this.handleStrategyClick}
          id="selection-row" className={"row col-12 mx-auto" + (this.props.selected ? " selected" : "")}
        >
          <h3 className="col-11 px-0 strategy-editor-header my-auto">{this.props.strategy}</h3>
          <div className="col-1 px-0">
            <button id="remove-btn-container" className="my-auto" onClick={this.handleDeleteClick} onMouseDown={e => e.preventDefault()}>
              <CloseSVG id="remove-btn-icon"/>
            </button>
          </div>
        </div>
    )
  }
}

export default class SavedStrategies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: ["Strategy 1", "Test Strategy"]
    }
  }

  handleStrategyClick = (method) => {
    if(this.props.selected !== method) {
      this.props.handleSelected(method);
    } else {
      this.props.handleSelected(undefined);
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
          {
            this.state.items.map((strategy, i) => <SelectionRow selected={strategy === this.props.selected} strategy={strategy} handleStrategyClick={this.handleStrategyClick} key={i}/>)
          }
        </div>
      </div>
    );
  }
}