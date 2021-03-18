import React, { Component } from 'react';
import {ReactComponent as SettingsSVG} from '../images/settings.svg';
import { Modal, Button } from "react-bootstrap";
import '../css/settings.css';

class News extends Component {
  state = {
    show: false,
    error: "",
    submitting: false
  }

  onRestart = () => {
    this.props.socket.emit("restart");
    this.setShow(false);
  }

  /**
   * Sets the visibility of the editModal.
   */
   setShow = bool => {
    this.setState({ show: bool});
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
              <p className="mb-2">Settings will go here.</p>
              <Button variant="secondary" onClick={handleClose} disabled={true}>
                Save settings
              </Button>
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

export default News;