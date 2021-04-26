import React, { Component } from 'react';
import '../../css/dashboard/trade-modal.css';
import { Modal, Button } from "react-bootstrap";
import Plot from 'react-plotly.js';

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

  resizeFigure = (width, height) => {
    let figureLayout = {...this.state.selected.figure.layout};
    figureLayout.width = width;
    figureLayout.height = height;
    return figureLayout;
  }

  render() {
    return (
      <Modal 
        show={this.props.show} 
        onHide={this.props.handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{fontSize: "30pt"}}>{this.state.selected?.ticker}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pb-0">
          <Plot data={this.state.selected?.figure.data} layout={this.state.selected?.figure.layout} config={{'displayModeBar': false, "showTips": false}}/>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default TradeModal;