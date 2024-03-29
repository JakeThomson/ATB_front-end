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
      strategyName: "",
      editing: false,
      submitting: false,
      selected: undefined,
      existingStrategyData: [],
      strategyData: [],
      formConfigurations: {}
    }
  }

  /**
   * When component mounts, then grab all the available analysis modules from backtesting platform/database.
   */
  componentDidMount() {
    if(this.props.location.state.action === "edit") {
      const { strategyId, strategyName, technicalAnalysis, action } = this.props.location.state;
      this.setState({strategyId, strategyName, existingStrategyData: technicalAnalysis, strategyData: technicalAnalysis, action});
    } else {
      this.setState({strategyName: this.props.location.state.strategyName, action: this.props.location.state.action});
    }

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
  }

  /**
   * When analysis module is clicked, set it as the focus.
   * @param {Object} selected 
   */
  handleSelected = (selected) => {
    this.setState({
      selected,
    });
  }

  /**
   * When user clicks on strategy name, set state to in or out of editing mode.
   */
  handleRenameClick = () => {
    this.setState({editing: !this.state.editing});
  }

  /**
   * Remove the analysis module from the strategy on delete click. 
   * @param {Object} method - Data on the module to be removed.
   */
  handleRemoveModuleClick = (method) => {
    const newStrategyData = this.state.strategyData.filter(item => item.name !== method);
    this.setState({
      strategyData: newStrategyData
    })
  }

  /**
   * Add the analysis module to the strategy.
   * @param {Object} method - Data on the module to be removed.
   */
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

  /**
   * Handle change of strategy name.
   * @param {Object} event - Event object containing information on new strategy name.
   */
  handleChange(event) {
    if(this.state.editing) {
      this.setState({strategyName: event.target.value});
    }
  }

  /**
   * Handle change of input form data.
   * @param {Object} event - Object containing information on new form data.
   */
  handleFormInputChange(event) {
    let newStrategyData = JSON.parse(JSON.stringify(this.state.strategyData));
    // Update data in strategyData object with the new data.
    for(var i = 0; i < this.state.strategyData.length; i += 1) {
      if(this.state.strategyData[i].name === event.target.getAttribute('form')) {
        newStrategyData[i].config[event.target.id] = event.target.type === "number" ? parseInt(event.target.value) : event.target.value;
      }
    }
    this.setState({strategyData: newStrategyData});
  }

  /**
   *  Reorder the analysis modules after drag and drop.
   */
  handleModuleReorder = (startIndex, endIndex) => {
    const result = Array.from(this.state.strategyData);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    this.setState({strategyData: result});
  };

  /**
   * Send new strategy data to database, post if creating strategy, put if editing a strategy.
   */
  handleSaveClick = (e) => {
    this.setState({submitting: true});

    const body = {
      "strategyName": this.state.strategyName,
      "strategyData": this.state.strategyData
    }

    if(this.state.action === "edit") {
      // Patch request to update database
      fetch(this.state.server + "/strategies/" + this.state.strategyId, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      .then(() => this.props.history.push({pathname: '/strategy-manager', state: {strategyId: this.state.strategyId}}))
      .catch(err => {
        this.setState({submitting: false})
        console.error(err)
      });
    } else if(this.state.action === "new") {
      // Post request to update database
      fetch(this.state.server + "/strategies", {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      .then(response => response.json())
      .then((data) => this.props.history.push({pathname: '/strategy-manager', state: {strategyId: data.strategyId}}))
      .catch(err => {
        this.setState({submitting: false})
        console.error(err)
      });
    }
  }

  render() {
    return (
      <div id="wrapper">
        <div id="strategy-name-container" style={{fontSize: "2rem"}}>
          {
            this.state.editing 
            ? 
              <div id="edit-btn-container" className="row col-12 mx-auto px-0">
                <div className="col-12">
                  <input type="text" 
                    className="ml-0 px-2 w-100"
                    value={this.state.strategyName} 
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
                <h2 className="strategy-editor-header ml-4 text-nowrap overflow-hidden" style={{marginTop:".4rem", maxWidth:"86%"}} >{this.state.strategyName}</h2>
                <EditSVG id="edit-btn-icon" />
              </div>
          }
        </div>
        <button disabled={this.state.strategyId === 69} id="save-btn-container" onMouseDown={e => e.preventDefault()} onClick={this.handleSaveClick} >
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
