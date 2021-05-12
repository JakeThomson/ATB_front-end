import React, { Component } from 'react';
import { Modal, Button } from "react-bootstrap";
import AnalysisModuleTile from './AnalysisModuleTile.react'
import '../../css/strategy-editor/selections.css';


class AddModule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    }
  }
  
  /**
   * Changes the visibility of the add module modal.
   * @param {bool} bool - True to set visible, False to set hidden. 
   */
  setShow = bool => {
    this.setState({ show: bool});
  }

  // Handle click on hide modal buttons.
  handleClick = (method) => {
    this.setState({ show: false })
    this.props.handleClick(method)
  }

  // Disable module choice if it already in the strategy. 
  isSelected = (method) => {
    if(this.props.selectedModules.includes(method)){
      return true;
    } else {
      return false;
    }
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
              {this.props.options.map((method, index) => 
                <AnalysisModuleTile method={method} disabled={(method) => this.isSelected(method)} handleClick={this.handleClick} key={method}/>
              )}
            </div>
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}

export default AddModule;