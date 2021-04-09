import React, { Component } from 'react';
import { Modal, Button } from "react-bootstrap";
import AnalysisModuleTile from './AnalysisModuleTile.react'
import '../../css/strategy-editor/selections.css';


class AddModule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    }
  }

  setShow = bool => {
    // Sets the visible state of the modal.
    this.setState({ show: bool});
  }

  render() {
    const handleClose = () => this.setShow(false);
    const handleShow = () => this.setShow(true);
    return (
      <div>
        <Button id="selection-row" className="add-module-btn" onClick={handleShow} onMouseDown={e => e.preventDefault()}>
          <h3 className="strategy-editor-header my-auto" style={{color: "#929292"}}>Add module</h3>
        </Button>
        <Modal 
          dialogClassName="modal-90w"
          show={this.state.show} 
          onHide={handleClose}
        >
          <Modal.Header closeButton>
            <Modal.Title>Select Analysis Module</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="column row col-12 mx-auto pt-3 px-0" style={{height: "260px"}}>
              <AnalysisModuleTile />
              <AnalysisModuleTile />
            </div>
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}

export default AddModule;