import React, { Component } from 'react';
import Selections from '../components/strategy-editor/Selections.react';
import SelectionConfig from '../components/strategy-editor/SelectionConfig.react';
import styled from 'styled-components';
import '../css/strategy-editor/strategy-editor.css';
import {ReactComponent as SaveSVG} from '../images/save-file.svg';
import {ReactComponent as CloseSVG} from '../images/close.svg';
import {ReactComponent as EditSVG} from '../images/pencil.svg';


class StrategyEditor extends Component {
  state = {
    title: "Strategy 1",
    editing: false
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleClick(bool) {
    this.setState({editing: bool});
  }

  handleSave = (val) => {
    this.setState({title: val});
  }

  handleChange(event) {
    if(this.state.editing) {
      this.setState({title: event.target.value});
    }
  }

  render() {
    return (
      <div id="wrapper">
        <div id="strategy-name-container" style={{fontSize: "2rem"}}>
          {
            this.state.editing ? 
            <div id="edit-btn-container" className="row col-12 mx-auto px-0">
              <div className="col-12">
                <input type="text" 
                  className="ml-0 px-2 w-100"
                  value={this.state.title} 
                  onChange={this.handleChange} 
                  autoFocus={true} 
                  onBlur={() => this.handleClick(false)}
                  onKeyDown={(e) => {
                    if(e.key === 'Enter') {
                      this.setState({editing: false})
                    }
                  }}
                />
              </div>
            </div>
            :
            <div id="edit-btn-container" onMouseDown={e => e.preventDefault()} onClick={() => this.handleClick(true)}>
              <h2 className="strategy-editor-header ml-4 text-nowrap overflow-hidden" style={{marginTop:".4rem", maxWidth:"86%"}} >{this.state.title}</h2>
              <EditSVG id="edit-btn-icon" />
            </div>
          }
        </div>
        <button id="save-btn-container" onMouseDown={e => e.preventDefault()}>
          <SaveSVG id="save-btn-icon" />
        </button>
        <button id="back-btn-container" onMouseDown={e => e.preventDefault()}>
          <CloseSVG id="back-btn-icon" />
        </button>
        <Selections />
        <SelectionConfig />
        <div className="background">
          <div id="bg-square-1"/>
          <div id="bg-square-2"/>
          <div id="bg-square-3"/>
          <div id="bg-square-4"/>
        </div>
      </div>
    );
  }
}

export default StrategyEditor;
