import React, { Component } from 'react';
import '../../css/strategy-manager/strategy-info.css';
import { Modal, Button, Accordion, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import moment from 'moment';
import {ReactComponent as ArrowSVG} from '../../images/arrow.svg';
import Plot from 'react-plotly.js';

class Backtest extends Component {
  constructor(props) {
    super(props);
    moment.locale('en', {
      relativeTime: {
        future: '%s',
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
  }

  resizeFigure = (width, height) => {
    let figureLayout = {...this.props.totalProfitLossGraph.layout};
    figureLayout.width = width;
    figureLayout.height = height;
    return figureLayout;
  }

  

  render() {  
    const WIDTH = 101; // 0 to 100
    const HEIGHT = 1;
    let context;

    function initCanvas(gradientColors) // gradientColors [colorA, colorB, ..]
    {
      // Canvas
      const canvasElement = document.createElement("CANVAS");
      canvasElement.width = WIDTH;
      canvasElement.height = HEIGHT;

      context = canvasElement.getContext("2d");
      
      // Gradient
      const gradient = context.createLinearGradient(0, 0, WIDTH, 0); // x0, y0, x1, y1
      
      const step = 1 / (gradientColors.length - 1); // need to validate at least two colors in gradientColors
      let val = 0;
      gradientColors.forEach(color => {
        gradient.addColorStop(val, color);
        val += step;
      });

      // Fill with gradient
      context.fillStyle = gradient;
      context.fillRect(0, 0, WIDTH, HEIGHT); // x, y, width, height
    }

    function getColor(percent) // percent [0..100]
    {
      if(percent === "N/A") {
        return 'rgba(250,0,0,0.3)'
      }
      const color = context.getImageData(percent, 0, 1, 1); // x, y, width, height
      const rgba = color.data;
      
      return `rgb(${ rgba[0] }, ${ rgba[1] }, ${ rgba[2] })`;
    }

    initCanvas(['red', '#D11D1D', 'orange', 'green', '#14D717', 'lime']);

    return (
      <div id="backtest-container" className="container row px-0 mx-0">
        <div className="d-flex col-4 px-0">
          <Plot className="my-auto" data={this.props.totalProfitLossGraph.data} layout={this.resizeFigure(90, 30)} config={{'staticPlot': true}} /> 
        </div>
        <div className="col-5 px-0">
          <div id="backtest-stat-text">Success rate: <span style={{color: getColor(this.props.successRate)}}><b>{Math.round(this.props.successRate*10)/10}%</b></span></div>
          <div id="backtest-stat-text">Profit/Loss: <span style={{color: this.props.totalProfitLossPct < 0 ? "rgb(211, 63, 73)" : "green"}}><b>{(this.props.totalProfitLossPct > 0 ? "+" : "") + Math.round(this.props.totalProfitLossPct*10)/10}%</b></span></div>
        </div>
      <div className="col-3 px-1 my-auto" id="backtest-stat-text" style={{color: "#949494"}}>{isNaN(this.props.datetimeFinished) ? "In progress" : this.props.datetimeFinished.fromNow()}</div>
      </div>
    )
  }
}

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

  componentDidMount() {
    this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.selected?.strategyId !== prevProps.selected?.strategyId) {
      this.setState({activeCardKey: "0"});
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

  getRunningTime = () => {
    var start = this.props.selected.backtests[0].datetimeStarted; //todays date
    var end = moment(); // another date
    var duration = moment.duration(end.diff(start));
    return `${duration.hours() < 10 ? "0" + duration.hours() : duration.hours()}:${duration.minutes() < 10 ? "0" + duration.minutes() : duration.minutes()}:${duration.seconds() < 10 ? "0" + duration.seconds() : duration.seconds()}`;
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
                
                  <Accordion activeKey={this.state.activeCardKey || "0"} style={{minWidth: "100%"}}>
                    <Card style={{border: 0}}>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body className="container row p-0 mx-auto mb-1">
                            {!this.checkValid() ? <div className="col-12 px-0 mb-1 text-center text-danger"><i>Strategy contains an invalid module</i></div> : null}
                            { 
                              this.props.selected.active 
                              ?
                                <div className="col-12 px-0 mb-1 text-center" style={{fontSize: "10pt"}}><i>Backtest has been running for {this.getRunningTime()}</i></div>
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
                              <h2 className="mb-0">{this.props.selected.avgSuccess === "N/A" ? this.props.selected.avgSuccess : Math.round(this.props.selected.avgSuccess*10)/10 + "%"}</h2>
                              <h6>Avg. success rate</h6>
                            </div>
                            <div className="col-6 px-0 text-center">
                              <h2 className="mb-0">{this.props.selected.avgReturns === "N/A" ? this.props.selected.avgReturns : "+" + Math.round(this.props.selected.avgReturns*10)/10 + "%"}</h2>
                              <h6>Avg. returns</h6>
                            </div>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                    {
                      this.props.selected.backtests.length === 0 ? null
                      :
                        <Card style={{border: 0}}>
                          <Card.Header className="p-0" style={{border: 0, backgroundColor: "transparent", cursor: "pointer"}}>
                            <Accordion.Toggle style={{border: 0, borderRadius: "5px"}} className="container row mx-auto px-3 py-2" as={Card.Header} variant="link" eventKey="1" onClick={this.changeCard}>
                              Past Backtests
                              <ArrowSVG className={"my-auto mr-1 ml-auto chevron--" + (this.state.activeCardKey === "0" ? "up" : "down")} />
                            </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="1">
                            <Card.Body className="strategy-info-container px-0 pt-2">
                                {this.props.selected.backtests.map((backtest, i, backtests) => <div key={backtest.backtestId}><Backtest {...backtest} />{backtests[i+1] === undefined ? null : <hr id="backtest-separator"/>}</div>)}
                            </Card.Body>
                          </Accordion.Collapse>
                        </Card>
                    }
                  </Accordion>
              </div>
            : null
          }
      </div>
    )
  }
}

export default StrategyInfo;