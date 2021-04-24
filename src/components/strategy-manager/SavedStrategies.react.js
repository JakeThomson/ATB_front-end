import React, { Component } from "react";
import '../../css/strategy-manager/saved-strategies.css';
import {ReactComponent as AddSVG} from '../../images/close.svg';
import {ReactComponent as HistorySVG} from '../../images/history.svg';
import {ReactComponent as SuccessSVG} from '../../images/checked.svg';
import { Link } from "react-router-dom";

class SelectionRow extends Component {
  constructor(props) {
    super(props);
    this.checkValid = this.checkValid.bind(this);
  }

  handleStrategyClick = () => {
    this.props.handleStrategyClick(this.props.strategy);
  }

  handleDeleteClick = (e) => {
    e.stopPropagation();
    this.props.handleRemoveClick(this.props.strategy);
  }
  
  checkValid = () => {
    if(this.props.availableModules.length === 0) {
      return true;
    }
    for(let i=0; i<this.props.strategy.technicalAnalysis.length; i++) {
      if(!this.props.availableModules.includes(this.props.strategy.technicalAnalysis[i].name)) {
        return false;
      }
    }
    return true;
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
      const color = context.getImageData(percent, 0, 1, 1); // x, y, width, height
      const rgba = color.data;
      
      return `rgb(${ rgba[0] }, ${ rgba[1] }, ${ rgba[2] })`;
    }

    initCanvas(['red', '#D11D1D', 'orange', 'green', '#14D717', 'lime']);

    return (
        <div
          onClick={this.handleStrategyClick}
          id="selection-row" className={"row col-12 mx-auto" + (this.checkValid() ? "" :  " invalid") + (this.props.selected ? " selected" : "")}
        >
          <div className="saved-strategy-name-container container row mx-auto px-0 justify-content-around">
            <h5 className="col-12 px-0 saved-strategy-name py-1">{this.props.strategy.strategyName}</h5>
              { this.props.strategy.active === true ? 
                <div className="d-flex">
                  <HistorySVG id="last-run-icon" className="my-auto mr-1"/>
                  <p className="m-0" style={{fontSize: "10pt"}}>Running...</p>
                </div> :
                <div className="d-flex">
                    <HistorySVG id="last-run-icon" className="my-auto mr-1"/>
                    <p className="m-0" style={{fontSize: "10pt"}}>{this.props.strategy.lastRun}</p>
                </div>
              }
              <div className="d-flex">
                  <SuccessSVG id="avg-success-icon" className="my-auto mr-1" style={{fill: getColor(this.props.strategy.avgSuccess)}}/>
                  <p className="m-0" style={{fontSize: "10pt"}}>{this.props.strategy.avgSuccess}%</p>
              </div>
          </div>
        </div>
    )
  }
}

export default class SavedStrategies extends Component {
  handleStrategyClick = (method) => {
    if(this.props.selected !== method) {
      this.props.handleSelected(method);
    } else {
      this.props.handleSelected(undefined);
    }
  }

  generateNewStrategyName = () => {
    let num = undefined;
    let re = /^New\sStrategy\s?(\d*)/;
    if(this.props.savedStrategyData !== undefined){
      for(let i=0; i<this.props.savedStrategyData.length; i++) {
        let match = re.exec(this.props.savedStrategyData[i].strategyName);
        if(match !== null) {
          if(match[1] === "" && num === undefined) {
            num = 1;
          } else if(parseInt(match[1]) === num) {
            num = parseInt(match[1]) + 1;
          }
        }
      }
    }
    return "New Strategy" + (num === undefined ? "" : " " + num);
  }

  render() {
    return (
      <div id="selections-container" className="container d-flex py-2 px-3">
        <h5 className="col-8 px-0 strategy-editor-header">Saved strategies</h5>
        <Link to={{pathname: "/strategy-editor", state: {strategyName: this.generateNewStrategyName(), action: "new"}}}  id="new-btn-container" onMouseDown={e => e.preventDefault()}>
          Create
          <AddSVG id="new-btn-icon"/>
        </Link>
        <div id="selection-row-container">
          {
            this.props.savedStrategyData === undefined ? null :
            this.props.savedStrategyData.length === 0 ?
            <div className="row col-12 mx-auto h-100 "><div className="m-auto" style={{position: "relative", bottom: "15px", fontSize: "13pt", fontWeight: "500", color:"#c2c2c2"}}>No saved strategies!</div></div>
            : this.props.savedStrategyData.map((strategy, i) => <SelectionRow selected={strategy === this.props.selected} availableModules={this.props.availableModules} strategy={strategy} handleStrategyClick={this.handleStrategyClick} key={i}/>)
          }
        </div>
      </div>
    );
  }
}