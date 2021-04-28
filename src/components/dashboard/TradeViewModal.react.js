import React, { Component } from 'react';
import '../../css/dashboard/trade-modal.css';
import { Modal } from "react-bootstrap";
import Plot from 'react-plotly.js';
import lodash from 'lodash';

class TradeModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tradeType: undefined,
      selected: undefined,
      tracking: true,
      storedAxisRange: [],
      aged: false
    }
  }

  componentDidMount() {
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

    selected = lodash.cloneDeep(selected);

    if(selected !== undefined) {
      this.setState({selected, tradeType});
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

      let prevSelected = prevProps.openTrades.find(obj => {
        return obj.tradeId === this.props.selectedTradeId;
      });
      if(prevSelected === undefined) {
        prevSelected = prevProps.closedTrades.find(obj => {
          return obj.tradeId === this.props.selectedTradeId;
        });
      }

      if(selected === undefined && prevSelected !== undefined) {
        const storedAxisRange = [prevSelected.figure.layout.xaxis.range, prevSelected.figure.layout.yaxis.range];
        this.setState({aged: true, storedAxisRange});
      }

      selected = lodash.cloneDeep(selected);

      if(selected !== undefined) {
        if(!this.state.tracking) {
          selected.figure.layout = this.state.selected.figure.layout;
        }
        this.setState({selected, tradeType});
      }
    }
  }

  resizeFigure = (width, height) => {
    let figureLayout = {...this.state.selected.figure.layout};
    figureLayout.width = width;
    figureLayout.height = height;
    return figureLayout;
  }

  handleDoubleClick = () => {
    let selected =  lodash.cloneDeep(this.state.selected);
    const tracking = this.state.tracking;

    if(tracking) {
      if(!this.state.aged){
        const storedAxisRange = [selected.figure.layout.xaxis.range, selected.figure.layout.yaxis.range];
        this.setState({storedAxisRange});
      }
      selected.figure.layout.xaxis.autorange = true;
      delete selected.figure.layout.xaxis.range;
      selected.figure.layout.yaxis.autorange = true;
      delete selected.figure.layout.yaxis.range;
      this.setState({selected, tracking: false});
    } else {
      selected.figure.layout.xaxis.autorange = false;
      selected.figure.layout.xaxis.range = lodash.cloneDeep(this.state.storedAxisRange[0]);
      selected.figure.layout.yaxis.autorange = false;
      selected.figure.layout.yaxis.range = lodash.cloneDeep(this.state.storedAxisRange[1]);
      this.setState({selected, tracking: true});
    }
  }

  handleRelayout = (e) => {
    if(Object.keys(e).length > 0) {
      if(this.state.tracking) {
        let selected = this.props.openTrades.find(obj => {
          return obj.tradeId === this.props.selectedTradeId;
        });
        if(selected === undefined) {
          selected = this.props.closedTrades.find(obj => {
            return obj.tradeId === this.props.selectedTradeId;
          });
        }
        
        selected = lodash.cloneDeep(selected);

        if(!this.state.aged){
          let storedAxisRange;
          if(selected === undefined) {
            storedAxisRange = [this.state.selected.figure.layout.xaxis.range, this.state.selected.figure.layout.yaxis.range];
          } else {
            storedAxisRange = [selected.figure.layout.xaxis.range, selected.figure.layout.yaxis.range];
          }
          this.setState({storedAxisRange});
        }
      }
      this.setState({tracking: false});
    }
  }

  render() {
    return (
      <Modal 
        show={this.props.show} 
        onHide={this.props.handleClose}
        style={{overflowY: "hidden"}}
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
          <Plot data={this.state.selected?.figure.data} layout={this.state.selected?.figure.layout} config={{'displayModeBar': false, "showTips": false, doubleClick: false}} onRelayout={this.handleRelayout} onDoubleClick={this.handleDoubleClick} />
        </Modal.Footer>
      </Modal>
    )
  }
}

export default TradeModal;