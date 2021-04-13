import React, { Component } from 'react';
import Selections from '../components/strategy-editor/Selections.react';
import SelectionConfig from '../components/strategy-editor/SelectionConfig.react';
import '../css/strategy-editor/strategy-editor.css';
import { Link } from "react-router-dom";
import {ReactComponent as SaveSVG} from '../images/save-file.svg';
import {ReactComponent as CloseSVG} from '../images/close.svg';
import {ReactComponent as EditSVG} from '../images/pencil.svg';


class StrategyEditor extends Component {
  existingData = [
      {
        "name": "Moving Averages",
        "config": {
          "shortTermType": "SMA",
          "shortTermDayPeriod": 20,
          "longTermType": "SMA",
          "longTermDayPeriod": 50,
        }
      }
    ]

  state = {
    title: "Strategy 1",
    editing: false,
    selected: undefined,
    existingStrategyData: this.existingData,
    strategyData: this.existingData,
    configurationForms: {
      "Moving Averages": [
        {
          "id": "shortTermType",
          "label": "Short-term MA type",
          "type": "multiSelect",
          "options": ["SMA", "EMA"],
        },
        {
          "id": "shortTermDayPeriod",
          "label": "Short-term period (days)",
          "type": "number",
          "limits": [0, 365]
        },
        {
          "id": "longTermType",
          "label": "Long-term MA type",
          "type": "multiSelect",
          "options": ["SMA", "EMA"]
        },
        {
          "id": "longTermDayPeriod",
          "label": "Long-term period (days)",
          "type": "number",
          "limits": [0, 365]
        }
      ],
      "Bollinger Bands": [
        {
          "id": "dayPeriod",
          "label": "Period (days)",
          "type": "number",
          "limits": [0, 365]
        }
      ]
    }
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleFormInputChange = this.handleFormInputChange.bind(this);
  }

  handleClick(bool) {
    this.setState({editing: bool});
  }

  handleSave = (val) => {
    this.setState({title: val});
  }

  handleSelected = (selected) => {
    this.setState({
      selected,
      formData: this.state.configurationForms[selected].map
    });
  }

  handleRenameClick = (selected) => {
    this.setState({selected});
  }

  handleSelected = (selected) => {
    this.setState({
      selected,
    });
  }

  handleAddModuleClick = (method) => {
    this.state.strategyData.push()
  }

  handleChange(event) {
    if(this.state.editing) {
      this.setState({title: event.target.value});
    }
  }

  handleFormInputChange(event) {
    let newStrategyData = JSON.parse(JSON.stringify(this.state.strategyData));
    for(var i = 0; i < this.state.strategyData.length; i += 1) {
      if(this.state.strategyData[i].name === event.target.getAttribute('form')) {
        newStrategyData[i].config[event.target.id] = event.target.value;
      }
    }
    this.setState({strategyData: newStrategyData});
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
                  onBlur={() => this.handleRenameClick(false)}
                  onKeyDown={(e) => {
                    if(e.key === 'Enter') {
                      this.setState({editing: false})
                    }
                  }}
                />
              </div>
            </div>
            :
            <div id="edit-btn-container" onMouseDown={e => e.preventDefault()} onClick={() => this.handleRenameClick(true)}>
              <h2 className="strategy-editor-header ml-4 text-nowrap overflow-hidden" style={{marginTop:".4rem", maxWidth:"86%"}} >{this.state.title}</h2>
              <EditSVG id="edit-btn-icon" />
            </div>
          }
        </div>
        <button id="save-btn-container" onMouseDown={e => e.preventDefault()}>
          <SaveSVG id="save-btn-icon" />
        </button>
        <Link to="/" id="back-btn-container" onMouseDown={e => e.preventDefault()}>
          <CloseSVG id="back-btn-icon" />
        </Link>
        <Selections handleSelected={this.handleSelected} selected={this.state.selected} />
        <SelectionConfig selected={this.state.selected} configurationForms={this.state.configurationForms} strategyData={this.state.strategyData} handleInputChange={this.handleFormInputChange} />
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
