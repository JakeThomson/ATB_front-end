import React, { Component } from 'react';
import {ReactComponent as SettingsSVG} from '../images/settings.svg';
import { Modal, Button } from "react-bootstrap";
import Datetime from 'react-datetime';
import moment from 'moment';
import "react-datetime/css/react-datetime.css";
import '../css/settings.css';

class Settings extends Component {
  state = {
    show: true,
    error: "",
    submitting: false,
    startDate: moment("2015-01-01"),
    endDate: moment(),
    startBalance: 15000,
    marketIndex: "s&p500",
    capPct: 25,
    takeProfit: 1.02,
    stopLoss: 0.99
  }

  onRestart = () => {
    // When restart button is clicked, emit restart socket event.
    this.props.socket.emit("restart");
    this.setShow(false);
  }

  setShow = bool => {
    // Sets the visible state of the modal.
    this.setState({ show: bool});
  }

  handleInputChange = event => {
    console.log(event)
    const target = event.target,
          value = target.value,
          name = target.name;

    this.setState({
      [name]: value,
    })
  }

  handleStartDateChange = (startDate, event) => {
    // If it is a valid date, the datepicker will automatically convert it to a datetime object.
    if(this.state.startDate !== "" && typeof(startDate) === "object") {
      let adjustedDatetime = moment(this.state.startDate);
      adjustedDatetime.date(startDate.date());
      adjustedDatetime.month(startDate.month());
      adjustedDatetime.year(startDate.year());
      this.setState({ startDate: adjustedDatetime._d});
    } else {
      this.setState({ startDate });
    }
  }

  handleEndDateChange = (endDate, event) => {
    // If it is a valid date, the datepicker will automatically convert it to a datetime object.
    if(this.state.endDate !== "" && typeof(endDate) === "object") {
      let adjustedDatetime = moment(this.state.endDate);
      adjustedDatetime.date(endDate.date());
      adjustedDatetime.month(endDate.month());
      adjustedDatetime.year(endDate.year());
      this.setState({ endDate: adjustedDatetime._d});
    } else {
      this.setState({ endDate });
    }
  }

  validSubmission = (data) => {
    
    return true;
  }

  handleSubmit = (e) => {
    e.preventDefault();

    // Stop form from being changed/resubmitted whilst query is executing.
    this.setState({
      submitting: true,
    })

    // Deep clone component state, that the actual states are not altered.
    const data = JSON.parse(JSON.stringify(this.state));

    // Delete uneccessary vales from data.
    delete data.show;
    delete data.submitting;
    delete data.error;

    // Error handling
    if(this.validSubmission(data))  {
      // Update the properties
      console.log("Properties updated. ")
    }
  }

  render() {
    const handleClose = () => this.setShow(false);
    const handleShow = () => this.setShow(true);
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
            <form className="container px-0 mx-auto settings-form" onSubmit={this.handleSubmit}>
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
                      disabled: this.state.submitting
                    }} 
                    value={this.state.startDate} 
                    initialViewDate={this.state.startDate} 
                    onChange={this.handleStartDateChange} 
                    dateFormat="DD-MM-YYYY" 
                    timeFormat={false} 
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
                    value={this.state.endDate} 
                    initialViewDate={this.state.endDate} 
                    onChange={this.handleEndDateChange} 
                    dateFormat="DD-MM-YYYY" 
                    timeFormat={false} 
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
                  />
                </div>
                <div className="col-4 form-group px-1 pr-2">
                  <label className="px-0 col-form-label settings-form-label" htmlFor="marketIndex">Market index</label>
                  <select className="form-control settings-form-input" id="marketIndex" name="marketIndex" defaultValue={this.state.marketIndex} onChange={this.handleInputChange} disabled={this.state.submitting} >
                    <option value="s&p500">{'S&P500'}</option>
                  </select>
                </div>
                <div className="col-4 form-group px-1 pr-2">
                  <label className="px-0 col-form-label settings-form-label" htmlFor="capPct">Balance% / trade</label>
                  <div className="input-group">
                    <input 
                      className="form-control settings-form-input" 
                      id="capPct" 
                      type="number"
                      name="capPct" 
                      value={this.state.capPct} 
                      onChange={this.handleInputChange}
                      required 
                      autoComplete="off"
                      disabled={this.state.submitting} 
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
                    />
                  </div>
                </div>
                <Button className="mx-auto settings-form-submit-btn mb-3" variant="secondary" type="submit" disabled={this.state.submitting}>
                  Save
                </Button>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="danger" onClick={this.onRestart}>
              Restart backtest
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default Settings;