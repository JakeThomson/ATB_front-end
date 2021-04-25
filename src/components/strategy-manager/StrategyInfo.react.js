import React, { Component } from 'react';
import '../../css/strategy-manager/strategy-info.css';
import { Modal, Button, Accordion, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import moment from 'moment';
import {ReactComponent as ArrowSVG} from '../../images/arrow.svg';

class StrategyInfo extends Component {
  constructor(props) {
    super(props);

    moment.locale('en', {
      relativeTime: {
        future: 'in %s',
        past: '%s ago',
        s:  '1s',
        ss: '%ss',
        m:  '1m',
        mm: '%dm',
        h:  '1h',
        hh: '%dh',
        d:  '1d',
        dd: '%dd',
        M:  '1M',
        MM: '%dM',
        y:  '1Y',
        yy: '%dY'
      }
    });

    this.state = {
      show: false,
      activeCardKey: "0"
    }
  }

  setShow = bool => {
    // Sets the visible state of the modal.
    this.setState({ show: bool});
  }
  
  checkValid = () => {
    if(this.props.availableModules.length === 0) {
      return true;
    }
    for(let i=0; i<this.props.selected.technicalAnalysis.length; i++) {
      if(!this.props.availableModules.includes(this.props.selected.technicalAnalysis[i].name)) {
        return false;
      }
    }
    return true;
  }

  changeCard = () => {
    this.setState({activeCardKey: this.state.activeCardKey === "0" ? "1" : "0"})
  }

  render() {
    const handleClose = () => this.setShow(false);
    const handleShow = () => this.setShow(true);

    return (
      <div id="selection-config-container" className="container py-2 px-3">
        <h5 className="row col-12 strategy-editor-header">Strategy info</h5>
                  {
            this.props.selected ?
              <div className="container row mx-auto px-0">
                <div className="px-0 mx-auto mb-2">
                  <Button disabled={!this.checkValid()} className="restart-backtest-btn py-1" onMouseDown={e => e.preventDefault()} onClick={() => this.props.onStartBacktestClick(this.props.selected.strategyId)}>{this.props.selected.active ? "Restart" : "Start"} Backtest</Button>
                  <Link 
                    to={{
                        pathname: "/strategy-editor",
                        state: {strategyId: this.props.selected.strategyId, strategyName: this.props.selected.strategyName, technicalAnalysis: this.props.selected.technicalAnalysis, action: "edit"} 
                      }} 
                    className="mx-auto my-3" 
                    onMouseDown={e => e.preventDefault()} 
                  >
                    <Button className="edit-backtest-btn py-1 mx-3">
                      Edit
                    </Button>
                  </Link>
                  <Button className="delete-backtest-btn py-1" onMouseDown={e => e.preventDefault()} onClick={handleShow} disabled={this.props.selected.strategyId === 69}>Delete</Button>
                  <Modal 
                    show={this.state.show} 
                    onHide={handleClose}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <p className="mb-2 mt-3">Are you sure you want to delete this entry?</p>
                      <p className="mb-1"><b>Name:</b> {this.props.selected.strategyName}</p>
                    </Modal.Body>
                    <Modal.Footer>
                      <p className="text-danger mb-1 mr-auto pr-3">Warning: This action cannot be undone.</p>
                      <Button variant="secondary" onClick={handleClose} disabled={this.state.submitting}>
                        Cancel
                      </Button>
                      <Button variant="danger" onClick={() => {this.props.onDeleteBacktestClick(this.props.selected.strategyId); handleClose();}}>
                        Confirm
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </div>
                
        <div id="strategy-info-container" className="py-1">
                
                
                <Accordion activeKey={this.state.activeCardKey || "0"} style={{minWidth: "100%"}}>
                  <Card style={{border: 0}}>
                    <Accordion.Collapse eventKey="0">
                      <Card.Body className="container row p-0 mx-auto mb-1">
                        {!this.checkValid() ? <div className="col-12 px-0 mb-1 text-center text-danger"><i>Strategy contains an invalid module</i></div> : null}
                        { 
                          this.props.selected.active 
                          ?
                            <div className="col-12 px-0 mb-1 text-center" style={{fontSize: "10pt"}}><i>Backtest has been running for 00:38:05</i></div>
                          : 
                            this.props.selected.backtests[0] === undefined 
                            ?
                              <div className="col-12 px-0 mb-1 text-center" style={{fontSize: "10pt"}}><i>Strategy has not yet run a full backtest</i></div>
                            :
                              <div className="col-12 px-0 mb-1 text-center" style={{fontSize: "10pt"}}><i>Backtest last run {this.props.selected.backtests[0].datetimeFinished.fromNow()}</i></div>
                        }
                        <div className="col-12 px-0 text-center">
                          <h6 className="mb-0 mt-2">Selected Analysis Modules:</h6>
                          <p className="mb--1">{this.props.selected.technicalAnalysis.map(a => a.name).join(", ")}</p>
                        </div>
                        <div className="col-6 px-0 text-center">
                          <h2 className="mb-0">{this.props.selected.avgSuccess === "N/A" ? this.props.selected.avgSuccess : this.props.selected.avgSuccess + "%"}</h2>
                          <h6>Avg. success rate</h6>
                        </div>
                        <div className="col-6 px-0 text-center">
                          <h2 className="mb-0">{this.props.selected.avgReturns === "N/A" ? this.props.selected.avgReturns : "+" + this.props.selected.avgReturns + "%"}</h2>
                          <h6>Avg. returns</h6>
                        </div>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                  <Card style={{border: 0}}>
                    <Card.Header className="p-0" style={{border: 0}}>
                      <Accordion.Toggle style={{border: 0}} className="container row mx-auto px-3 py-2" as={Card.Header} variant="link" eventKey="1" onClick={this.changeCard}>
                        {this.state.activeCardKey === "0" ? "Show Past Backtests" : "Show Strategy Summary"}
                        <ArrowSVG id="arrow-icon" className={"my-auto mr-1 ml-auto" + (this.state.activeCardKey === "0" ? " flip" : "")} />
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="1">
                      <Card.Body>Hello! I'm another body</Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              </div>
        </div>
            : null
          }
      </div>
    )
  }
}

export default StrategyInfo;