import React, { Component } from 'react';
import Selections from '../components/strategy-editor/Selections.react';
import SelectionConfig from '../components/strategy-editor/SelectionConfig.react';
import '../css/strategy-editor/strategy-editor.css';
import { Link, withRouter } from "react-router-dom";
import {ReactComponent as SaveSVG} from '../images/save-file.svg';
import {ReactComponent as CloseSVG} from '../images/close.svg';
import {ReactComponent as EditSVG} from '../images/pencil.svg';


class StrategyEditor extends Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleFormInputChange = this.handleFormInputChange.bind(this);

    // Detect environment application is running on and choose API URL appropriately.
    let serverURL = "";
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      serverURL = 'http://127.0.0.1:8080';
    } else {
      serverURL = 'https://trading-api.jake-t.codes';
    }

    this.state = {
      server: serverURL,
      title: "",
      editing: false,
      submitting: false,
      selected: undefined,
      existingStrategyData: [],
      strategyData: [],
      formConfigurations: {}
    }
  }

  componentWillMount() {
    // Fill UI with data from database.
    fetch(`${this.state.server}/strategies/modules`, {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      this.setState({ 
        formConfigurations: data
      })
    });

    // Fill UI with data from database.
    fetch(`${this.state.server}/strategies`, {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      this.setState({ 
        title: data.strategyName,
        existingStrategyData: data.technicalAnalysis,
        strategyData: data.technicalAnalysis,
      })
    });
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
    });
  }

  handleRenameClick = (selected) => {
    this.setState({selected, editing: !this.state.editing});
  }

  handleSelected = (selected) => {
    this.setState({
      selected,
    });
  }

  handleRemoveModuleClick = (method) => {
    const newStrategyData = this.state.strategyData.filter(item => item.name !== method);
    this.setState({
      strategyData: newStrategyData
    })
  }

  handleAddModuleClick = (method) => {
    const config = {};

    // What an absolutely horrifying chunk of code.
    // This essentially allows form data to be read from the existing strategy data, and if it doesn't 
    // exist, it uses the default set in the formConfigurations object.
    for(var i = 0; i < this.state.formConfigurations[method].length; i += 1) {
      config[this.state.formConfigurations[method][i].id] = 
        this.state.existingStrategyData.find(el => el.name === method)?.config[this.state.formConfigurations[method][i].id] 
          || this.state.formConfigurations[method][i].default
    }

    let newStrategyData = JSON.parse(JSON.stringify(this.state.strategyData));
    newStrategyData.push({"name": method, "config": config});
    this.setState({
      strategyData: newStrategyData
    })
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
        newStrategyData[i].config[event.target.id] = event.target.type === "number" ? parseInt(event.target.value) : event.target.value;
      }
    }
    this.setState({strategyData: newStrategyData});
  }

  // a little function to help us with reordering the result
  handleModuleReorder = (startIndex, endIndex) => {
    const result = Array.from(this.state.strategyData);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    this.setState({strategyData: result});
  };

  handleSaveClick = (e) => {
    this.setState({submitting: true});

    const body = {
      "strategyName": this.state.title,
      "strategyData": this.state.strategyData
    }

    // Patch request to update database
    fetch(this.state.server + "/strategies", {
      method: 'PUT',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    .then(() => this.props.history.push('/strategy-manager'))
    .catch(err => {
      this.setState({submitting: false})
      console.error(err)
    });
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
        <button id="save-btn-container" onMouseDown={e => e.preventDefault()} onClick={this.handleSaveClick} >
          <SaveSVG id="save-btn-icon" />
        </button>
        <Link to="/strategy-manager" id="back-btn-container" onMouseDown={e => e.preventDefault()}>
          <CloseSVG id="back-btn-icon" />
        </Link>
        <Selections handleSelected={this.handleSelected} strategyData={this.state.strategyData} selected={this.state.selected} handleModuleReorder={this.handleModuleReorder} handleAddModuleClick={this.handleAddModuleClick} handleRemoveModuleClick={this.handleRemoveModuleClick} options={Object.keys(this.state.formConfigurations)} />
        <SelectionConfig selected={this.state.selected} formConfigurations={this.state.formConfigurations} strategyData={this.state.strategyData} handleInputChange={this.handleFormInputChange} />
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

export default withRouter(StrategyEditor);
