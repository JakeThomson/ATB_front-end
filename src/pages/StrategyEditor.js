import React, { Component } from 'react';
import Selections from '../components/strategy-editor/Selections.react';
import SelectionConfig from '../components/strategy-editor/SelectionConfig.react';
import '../css/strategy-editor/strategy-editor.css';

class StrategyEditor extends Component {

  render() {
    return (
      <div id="wrapper">
        <div id="strategy-name-container">
          <h2 className="strategy-editor-header ml-2 mt-1" >Strategy 1</h2>
        </div>
        <div id="back-btn-container">
        </div>
        <div id="save-btn-container">
        </div>
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
