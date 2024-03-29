import React, { Component } from 'react';
import {ReactComponent as SettingsSVG} from '../../images/settings.svg';
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Datetime from 'react-datetime';
import moment from 'moment';
import "react-datetime/css/react-datetime.css";
import '../../css/dashboard/settings.css';

class Settings extends Component {
  constructor(props) {
    super(props);

    // Detect environment application is running on and choose API URL appropricately.
    let serverURL = "";
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      serverURL = 'http://127.0.0.1:8080';
    } else {
      serverURL = 'https://trading-api.jake-t.codes';
    }

    this.state = {
      show: false,
      error: "",
      successMsg: "",
      submitting: false,
      startDate: moment("2015-01-01"),
      endDate: moment().startOf('day'),
      startBalance: 0,
      marketIndex: '',
      capPct: 0,
      takeProfit: 0,
      stopLoss: 0,
      server: serverURL,
      strategyName: null
    }
  }

  componentDidMount() {
    // Update settings every time settings modal is opened.
    this.getSettings();
  }

  /**
   * Gets the currently saved backtest settings from the database.
   */
  getSettings = () => {
    fetch(`${this.state.server}/backtest_settings`, {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      // Fill UI with data from database.
      this.setState({ 
        startDate: moment(data.startDate), 
        endDate: moment(data.endDate),
        startBalance: data.startBalance,
        marketIndex: data.marketIndex,
        capPct: data.capPct,
        takeProfit: data.takeProfit,
        stopLoss: data.stopLoss,
        strategyName: data.strategyName,
        backtestOnline: data.backtestOnline
      })
      // Send new data to Dashboard.
      this.props.onGetSettings(data);
    });
  }

  /**
   * When restart button is clicked, emit restart socket event.
   */
  onRestart = () => {
    if(this.props.backtestOnline) {
      // Only emit event if the backtesting platform is online. 
      this.props.socket.emit("restart");
      this.setShow(false);
    } else {
      // Else, display error.
      this.setState({ error: "Cannot restart backtest when backtesting system is offline." })
    }

  }

  /**
   * Changes the visibility of the settings modal.
   * @param {bool} bool - True to set visible, False to set hidden. 
   */
  setShow = bool => {
    if(!bool){
      this.setState({successMsg: "", error: ""});
    } else {
      this.getSettings();
    }

    this.setState({ show: bool});
  }

  /**
   * Handles the change of information in the text and number input fields.
   * @param {Object} event - Event object containing new input data.
   */
  handleInputChange = event => {
    let target = event.target,
          value = target.value,
          name = target.name;
    
    if(name === "capPct") {
      value = value === "" ? "" : value/100;
    }

    this.setState({
      [name]: parseFloat(value),
      successMsg: ""
    })
  }

  /**
   * Handles the change of information in the start date date picker.
   * @param {Object} startDate - The newly chosen start date.
   * @param {Object} event - Event object containing new input data
   */
  handleStartDateChange = (startDate, event) => {
    // If it is a valid date, the datepicker will automatically convert it to a datetime object.
    if(this.state.startDate !== "" && typeof(startDate) === "object") {
      let adjustedDatetime = moment(this.state.startDate);
      adjustedDatetime.date(startDate.date());
      adjustedDatetime.month(startDate.month());
      adjustedDatetime.year(startDate.year());
      this.setState({ startDate: adjustedDatetime, successMsg: "" });
    } else {
      this.setState({ startDate, successMsg: "" });
    }
  }

  /**
   * Handles the change of information in the end date date picker.
   * @param {Object} endDate - The newly chosen end date.
   * @param {Object} event - Event object containing new input data
   */
  handleEndDateChange = (endDate, event) => {
    // If it is a valid date, the datepicker will automatically convert it to a datetime object.
    if(this.state.endDate !== "" && typeof(endDate) === "object") {
      let adjustedDatetime = moment(this.state.endDate);
      adjustedDatetime.date(endDate.date());
      adjustedDatetime.month(endDate.month());
      adjustedDatetime.year(endDate.year());
      this.setState({ endDate: adjustedDatetime, successMsg: "" });
    } else {
      this.setState({ endDate, successMsg: "" });
    }
  }

  /**
   * Checks to see if the data being submitted is valid.
   * @param {Object} data - The data to be validated. 
   * @returns {bool}
   */
  validSubmission = (data) => {
    // If start date is less than a month before the end date, then it is invalid.
    if(moment(data.startDate).isAfter(moment(data.endDate).subtract(1, 'months'))) {
      this.setState({
        error: `Start date must be at least a month before the end date.`,
        submitting: false
      })
      return false;
    }

    // Cannot accept start balances below 500.
    if(data.startBalance < 500) {
      this.setState({
        error: `Starting balance must be £500 or more.`,
        submitting: false
      })
      return false;
    }

    // Capital percent spent per trade cannot be less than 1 or greater than 100.
    if(100 < data.capPct || data.capPct <= 0) {
      this.setState({
        error: `Balance % spent per trade must be between 1-100.`,
        submitting: false
      })
      return false;
    }

    // If take profit is less than stop loss it is invalid 
    if(data.takeProfit <= data.stopLoss){
      this.setState({
        error: `Take profit must be higher than the stop loss.`,
        submitting: false
      })
      return false;
    }

    // If take profit is less than 1 it is invalid.
    if(data.takeProfit <= 1){
      this.setState({
        error: `Take profit must be higher than 1.`,
        submitting: false
      })
      return false;
    }

    // If stop loss is higher than 1 it is invalid.
    if(data.stopLoss >= 1){
      this.setState({
        error: `Stop loss must be less than 1.`,
        submitting: false
      })
      return false;
    }
    return true;
  }

  /**
   * Handle the form submit event.
   * @param {Object} e - Submit event object holding form data. 
   */
  handleSubmit = (e) => {
    e.preventDefault();

    // Stop form from being changed/resubmitted whilst query is executing.
    this.setState({
      submitting: true,
    });

    // Deep clone component state, that the actual states are not altered.
    const data = JSON.parse(JSON.stringify(this.state));

    // Delete uneccessary vales from data.
    delete data.show;
    delete data.submitting;
    delete data.error;
    delete data.successMsg;
    data.startDate = moment(data.startDate);
    data.endDate = moment(data.endDate);

    // Error handling
    if(this.validSubmission(data))  {
      // Patch request to update database
      fetch(this.state.server + "/backtest_settings", {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(res => res.json())
      .then(res => {
        this.setState({
          error: '',
          successMsg: 'Settings saved, backtest must be restarted for changes to take effect.',
          submitting: false
        });
        // Update saved settings in the Dashboard.
        this.props.onSettingsSaved(data);
      })
      .catch(err => {
        console.error(err)
        this.setState({
          error: 'Error occurred when saving settings.',
          successMsg: '',
          submitting: false
        });
      });
    }
  }

  /**
   * If the settings have not been changed, then make the save button inactive.
   * @returns {bool}
   */
  checkSettingsDifferent = () => {
    // Deep clone component state, that the actual states are not altered.
    const same = 
      this.props.savedSettings.startDate.isSame(this.state.startDate)
      && this.props.savedSettings.endDate.isSame(this.state.endDate)
      && this.props.savedSettings.startBalance === this.state.startBalance
      && this.props.savedSettings.marketIndex === this.state.marketIndex 
      && this.props.savedSettings.capPct === this.state.capPct
      && this.props.savedSettings.takeProfit === this.state.takeProfit
      && this.props.savedSettings.stopLoss === this.state.stopLoss;

    return same;
  }

  /**
   * Called by date picker to ensure those date are greyed out and cannot be selected.
   * @param {String} date - Date in the date selector.
   * @returns {bool}
   */
  validStartDate = ( date ) => {
    // Don't allow days before 2010-01-01 to be selected.
    if(moment(date).isBefore(moment("2010-01-01"))) {
      return false;
    }
    // Do not allow dates after the selected start date to be selected.
    if(moment(date).isAfter(moment(this.state.endDate))) {
      return false;
    }
    return true;
  };

  /**
   * Called by date picker to ensure those date are greyed out and cannot be selected.
   * @param {String} date - Date in the date selector.
   * @returns {bool}
   */
  validEndDate = ( date ) => {
    // Don't allow days after today to be selected.
    if(moment(date).isAfter(moment().startOf("day"))) {
      return false;
    }
    // Do not allow dates before the selected start date to be selected.
    if(moment(date).isBefore(moment(this.state.startDate))) {
      return false;
    }
    return true;
  };

  render() {
    const handleClose = () => this.setShow(false);
    const handleShow = () => this.setShow(true);
    let settingsChanged = this.checkSettingsDifferent();

    return (
      <div id="settings-container" className="d-flex flex-row justify-content-center">
        <button id="settings-btn" onClick={handleShow}>
          <SettingsSVG id="settings-icon" className={this.state.show ? "rotated" : ""}/>
        </button>
        <Modal 
          dialogClassName="modal-90w"
          show={this.state.show} 
          onHide={handleClose}
        >
          <Modal.Header closeButton>
            <Modal.Title>Backtest settings</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
              // Show error message in form if request was invalid.
              this.state.error !== "" ? <div className="text-danger col-12 px-0 pt-2 text-center settings-form-input pb-0 mb-0">{this.state.error}</div> : null
            }
            <div className="container row mx-0">
              <Link to="/strategy-manager" className="mx-auto mt-3 mb-1" >
                <Button className="settings-form-submit-btn py-1" style={{fontSize: "16px"}} >
                  Open Strategy Manager
                </Button>
              </Link>
              <div className="col-12 px-0 mb-2 text-center">Loaded strategy: <i>{this.state.strategyName === null ? <span className="text-danger">N/A</span> : this.state.strategyName}</i></div>
            </div>
            <form noValidate className="container px-0 mx-auto settings-form" onSubmit={this.handleSubmit}>
              <div className="row col-12 mx-0 px-1" >
                <div className="col-4 form-group px-1 pr-2">
                  <label className="px-0 col-form-label settings-form-label" htmlFor="startDate">Start date</label>
                  <Datetime 
                    inputProps={{
                      className:'form-control settings-form-input',
                      name: "startDate",
                      id: "startDate",
                      autoComplete: "off",
                      readOnly: false,
                      disabled: this.state.submitting,
                    }} 
                    isValidDate={ this.validStartDate }
                    value={this.state.startDate} 
                    initialViewDate={this.state.startDate} 
                    onChange={this.handleStartDateChange} 
                    dateFormat="DD-MM-YYYY" 
                    timeFormat={false}
                    closeOnSelect={true}
                  />
                </div>
                <div className="col-4 form-group px-1 pr-2">
                  <label className="px-0 col-form-label settings-form-label" htmlFor="endDate">End date</label>
                  <Datetime 
                    inputProps={{
                      className:'form-control settings-form-input',
                      name: "endDate",
                      id: "endDate",
                      autoComplete: "off",
                      readOnly: false,
                      disabled: this.state.submitting
                    }} 
                    isValidDate={ this.validEndDate }
                    value={this.state.endDate} 
                    initialViewDate={this.state.endDate} 
                    onChange={this.handleEndDateChange} 
                    dateFormat="DD-MM-YYYY" 
                    timeFormat={false} 
                    closeOnSelect={true}
                  />
                </div>
                <div className="col-4 form-group px-1">
                  <label className="px-0 col-form-label settings-form-label" htmlFor="startBalance">Start balance</label>
                  <input 
                    className="form-control settings-form-input" 
                    id="startBalance" 
                    type="number"
                    name="startBalance" 
                    value={this.state.startBalance} 
                    onChange={this.handleInputChange} 
                    step={1000}
                    required 
                    autoComplete="off"
                    disabled={this.state.submitting} 
                    inputMode="decimal"
                  />
                </div>
                <div className="col-4 form-group px-1 pr-2">
                  <label className="px-0 col-form-label settings-form-label" htmlFor="marketIndex">Market index</label>
                  <select className="form-control settings-form-input settings-form-select" id="marketIndex" name="marketIndex" defaultValue={this.state.marketIndex} onChange={this.handleInputChange} disabled={this.state.submitting} >
                    <option value="s&p500">{'S&P500'}</option>
                  </select>
                </div>
                <div className="col-4 form-group px-1 pr-2">
                  <label className="px-0 col-form-label settings-form-label" htmlFor="capPct">% per trade</label>
                  <div className="input-group">
                    <input 
                      className="form-control settings-form-input" 
                      id="capPct" 
                      type="number"
                      name="capPct" 
                      value={Math.round(this.state.capPct*100)} 
                      onChange={this.handleInputChange}
                      required 
                      autoComplete="off"
                      disabled={this.state.submitting} 
                      inputMode="decimal"
                    />
                    <div className="input-group-append">
                      <span className="input-group-text settings-form-input px-2">%</span>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="form-group row my-1 pr-1">
                    <label className="col-3 p-0 pl-2 pt-1 col-form-label settings-form-label" htmlFor="takeProfit">TP</label>
                    <input 
                      className="col-9 form-control settings-form-input" 
                      id="takeProfit" 
                      type="number"
                      name="takeProfit" 
                      value={this.state.takeProfit} 
                      onChange={this.handleInputChange}
                      step={0.01}
                      required 
                      disabled={this.state.submitting} 
                      inputMode="decimal"
                    />
                  </div>
                  <div className="form-group row pr-1">
                    <label className="col-3 p-0 pl-2 pt-1 col-form-label settings-form-label" htmlFor="stopLoss">SL</label>
                    <input 
                      className="col-9 form-control settings-form-input" 
                      id="stopLoss" 
                      type="number"
                      name="stopLoss" 
                      value={this.state.stopLoss} 
                      onChange={this.handleInputChange}
                      step={0.01}
                      required 
                      disabled={this.state.submitting} 
                      inputMode="decimal"
                    />
                  </div>
                </div>
                {
                  // Show error message in form if request was invalid.
                  this.state.successMsg !== "" ? <div className="mb-1 text-success col-12 px-0 pb-2 text-center settings-form-input">{this.state.successMsg}</div> : null
                }
                <Button className="mx-auto settings-form-submit-btn mb-3" variant="secondary" type="submit" disabled={settingsChanged}>
                  Save
                </Button>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button disabled={this.state.strategyName === null} variant="danger" onClick={this.onRestart}>
              Restart backtest
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default Settings;