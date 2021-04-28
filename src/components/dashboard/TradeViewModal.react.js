import React, { Component } from 'react';
import '../../css/dashboard/trade-modal.css';
import { Modal } from "react-bootstrap";
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
      if(selected !== undefined) {
        this.setState({selected, tradeType});
      }
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
        <Modal.Header closeButton className="pb-2">
          <Modal.Title style={{fontSize: "25pt"}}>
            {this.state.selected?.ticker} 
            <span style={{fontSize: "18pt", color: this.state.selected?.profitLossPct < 0 ? "rgb(211, 63, 73)" : "green"}}>
              {this.state.selected?.profitLossPct > 0 ? " +" : " "}
              {(Math.round(this.state.selected?.profitLossPct*100)/100).toFixed(2)}%
            </span>
            <p style={{fontSize: "10pt", marginBottom: 0, fontWeight: 400}}><b>Status:</b> {this.state.tradeType?.toUpperCase()}</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pb-1 pt-1">
          <div className="container row">
            <div className="col-4 px-0">
              <p style={{fontSize: "10pt", marginBottom: 0}}><b>Buy Price:</b> {(Math.round(this.state.selected?.buyPrice*100)/100).toFixed(2)}</p>
              <p style={{fontSize: "10pt", marginBottom: 0}}><b>Take Profit:</b> {(Math.round(this.state.selected?.takeProfit*100)/100).toFixed(2)}</p>
            </div>
            <div className="col-4 px-0">
              {
                this.state.selected?.sellPrice === undefined ? 
                  <p style={{fontSize: "10pt", marginBottom: 0}}><b>Current Price:</b> {(Math.round(this.state.selected?.currentPrice*100)/100).toFixed(2)}</p>
                :
                  <p style={{fontSize: "10pt", marginBottom: 0}}><b>Sell Price:</b> {(Math.round(this.state.selected?.sellPrice*100)/100).toFixed(2)}</p>
              }
              <p style={{fontSize: "10pt", marginBottom: 0}}><b>Stop Loss:</b> {(Math.round(this.state.selected?.stopLoss*100)/100).toFixed(2)}</p>
            </div>
            <div className="col-4 px-0">
              <p style={{fontSize: "10pt", marginBottom: 0}}><b>Share Qty:</b> {this.state.selected?.shareQty}</p>
              <p style={{fontSize: "10pt", marginBottom: 0}}>
                <b>Profit/Loss:</b>
                  {
                    this.state.selected?.sellPrice === undefined ? 
                      <span style={{color: this.state.selected?.profitLossPct < 0 ? "rgb(211, 63, 73)" : this.state.selected?.profitLossPct === 0 ? "black" : "green"}}>
                        {this.state.selected?.profitLossPct > 0 ? " +" : " "} 
                        {(Math.round(((this.state.selected?.currentPrice - this.state.selected?.buyPrice)*this.state.selected?.shareQty)*100)/100).toFixed(2)}
                      </span>
                    :
                      <span style={{color: this.state.selected?.profitLoss < 0 ? "rgb(211, 63, 73)" : this.state.selected?.profitLoss === 0 ? "black" : "green"}}>
                        {this.state.selected?.profitLoss > 0 ? " +" : " "} 
                        {(Math.round((this.state.selected?.profitLoss)*100)/100).toFixed(2)}
                      </span>
                  }
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Plot data={this.state.selected?.figure.data} layout={this.state.selected?.figure.layout} config={{'displayModeBar': false, "showTips": false}} />
        </Modal.Footer>
      </Modal>
    )
  }
}

export default TradeModal;