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

  handleDateChange = (startDate, event) => {
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
          <form onSubmit={this.handleSubmit} >
            <Modal.Header closeButton>
              <Modal.Title>Backtest settings</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form className="container px-0 mx-auto settings-form">
                <div className="row col-12 mx-0 px-1" >
                  <div className="col-6 form-group px-1 pr-2">
                    <label className="px-0 col-form-label settings-form-label" htmlFor="startDate">Start date</label>
                    <Datetime 
                      inputProps={{
                        className:'form-control settings-form-input',
                        name: "startDate",
                        id: "startDate",
                        autoComplete: "off",
                        readOnly: false
                      }} 
                      value={this.state.startDate} 
                      initialViewDate={this.state.startDate} 
                      onChange={this.handleDateChange} 
                      dateFormat="DD-MM-YYYY" 
                      timeFormat={false} 
                    />
                  </div>
                  <div className="col-6 form-group px-1 pl-2">
                    <label className="px-0 col-form-label settings-form-label" htmlFor="endDate">End date</label>
                    <Datetime 
                      inputProps={{
                        className:'form-control settings-form-input',
                        name: "endDate",
                        id: "endDate",
                        autoComplete: "off",
                        readOnly: false
                      }} 
                      value={this.state.endDate} 
                      initialViewDate={this.state.endDate} 
                      onChange={this.handleDateChange} 
                      dateFormat="DD-MM-YYYY" 
                      timeFormat={false} 
                    />
                  </div>
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
          </form>
        </Modal>
      </div>
    )
  }
}

export default Settings;