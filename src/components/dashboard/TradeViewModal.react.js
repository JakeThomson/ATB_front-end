import React, { Component } from 'react';
import '../../css/dashboard/trade-modal.css';
import { Modal, Button } from "react-bootstrap";

class TradeModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tradeType: undefined,
      selected: undefined
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedTradeId !== this.props.selectedTradeId || prevProps.openTrades !== this.props.openTrades || prevProps.closedTrades !== this.props.closedTrades) {
      let tradeType = "";
      let selected = this.props.openTrades.find(obj => {
        return obj.tradeId === this.props.selectedTradeId;
      });
      if(selected === undefined) {
        selected = this.props.closedTrades.find(obj => {
          return obj.tradeId === this.props.selectedTradeId;
        });
        tradeType = "closed";
      } else {
        tradeType = "open";
      }
      this.setState({selected, tradeType});
    }
  }


  setShow = bool => {
    // Sets the visible state of the modal.
    this.setState({ show: bool});
  }  

  render() {
    return (
      <Modal 
        show={this.props.show} 
        onHide={this.props.handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>{this.state.selected?.ticker}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-2 mt-3">Are you sure you want to delete this entry?</p>
          <p className="mb-1"><b>Name:</b> </p>
        </Modal.Body>
        <Modal.Footer>
          <p className="text-danger mb-1 mr-auto pr-3">Warning: This action cannot be undone.</p>
          <Button variant="secondary" onClick={this.props.handleClose}>
            Cancel
          </Button>
          <Button variant="danger">
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default TradeModal;