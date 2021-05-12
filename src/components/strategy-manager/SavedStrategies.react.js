import React, { Component } from "react";
import '../../css/strategy-manager/saved-strategies.css';
import {ReactComponent as AddSVG} from '../../images/close.svg';
import {ReactComponent as HistorySVG} from '../../images/history.svg';
import {ReactComponent as SuccessSVG} from '../../images/checked.svg';
import {ReactComponent as ProfitSVG} from '../../images/profitloss.svg';
import { Link } from "react-router-dom";
import moment from 'moment';

/**
 * Container for strategy object in list.
 */
class SelectionRow extends Component {
  constructor(props) {
    super(props);

    moment.updateLocale('en', {
      relativeTime: {
        future: 'in %s',
        past: '%s ago',
        s:  '%ds',
        ss: '%ds',
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

    this.checkValid = this.checkValid.bind(this);
  }

  /**
   * Updates the component every second (used for updating the 'time running' info).
   */
  componentDidMount() {
    this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000);
  }
  /**
   * Remove the update interval on unmount.
   */
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  /**
   * Display strategy info on click.
   */
  handleStrategyClick = () => {
    this.props.handleStrategyClick(this.props.strategy);
  }

  /**
   * Remove the strategy from the list of strategies on delete.
   * @param {Object} e - Object holding info on the strategy.
   */
  handleDeleteClick = (e) => {
    e.stopPropagation();
    this.props.handleRemoveClick(this.props.strategy);
  }
  
  /**
   * Checks to see if the strategy contains any invalid modules, changes style of container if it does.
   * @returns {bool}
   */
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

    /**
     * Changes colour of text based on percentage value using a 3 colour gradient.
     * Solution obtained from https://stackoverflow.com/a/63234313.
     * @param {String[]} gradientColors - Array of colours to use as a gradient.
     */
    function initCanvas(gradientColors)
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

    /**
     * Gets colour from gradient based on value.
     * Solution obtained from https://stackoverflow.com/a/63234313.
     * @param {int} percent - The percentage to be mapped to a colour.
     * @returns {String} - rgba string.
     */
    function getColor(percent) // percent [0..100]
    {
      if(percent === "N/A") {
        return 'rgba(250,0,0,0.3)'
      }
      const color = context.getImageData(percent, 0, 1, 1); // x, y, width, height
      const rgba = color.data;
      
      return `rgb(${ rgba[0] }, ${ rgba[1] }, ${ rgba[2] })`;
    }

    // Gradient of colours to move through based on values 0-100.
    initCanvas(['red', '#D11D1D', 'orange', 'green', '#14D717', 'lime']);

    return (
      <div
        onClick={this.handleStrategyClick}
        id="selection-row" className={"row col-12 mx-auto" + (this.checkValid() ? "" :  " invalid") + (this.props.selected ? " selected" : "")}
      >
        <div className="saved-strategy-name-container container row mx-auto px-0 justify-content-around" style={{marginBottom: "3px"}}>
          <h5 className="col-12 px-0 saved-strategy-name py-1">{this.props.strategy.strategyName}</h5>
            { this.props.strategy.active === true 
              ? 
                <div className="d-flex">
                  <HistorySVG id="last-run-icon" className="my-auto mr-1"/>
                  <p className="m-0" style={{fontSize: "10pt"}}>Running...</p>
                </div> 
              :
                this.props.strategy.backtests[0] === undefined 
                ?
                  <div className="d-flex">
                    <HistorySVG id="last-run-icon" className="my-auto mr-1" style={{opacity: "50%"}}/>
                    <p className="m-0" style={{fontSize: "10pt"}}>No history</p>
                  </div>
                : 
                  <div className="d-flex">
                    <HistorySVG id="last-run-icon" className="my-auto mr-1"/>
                    <p className="m-0" style={{fontSize: "10pt"}}>{this.props.strategy.backtests[0].datetimeFinished.fromNow()}</p>
                  </div>
            }
            <div className="d-flex">
                <SuccessSVG id="avg-success-icon" className="my-auto mr-1" style={{fill: getColor(this.props.strategy.avgSuccess)}}/>
                <p className="m-0" style={{fontSize: "10pt"}}>{this.props.strategy.avgSuccess === "N/A" ? this.props.strategy.avgSuccess : Math.round(this.props.strategy.avgSuccess*10)/10 + "%"}</p>
            </div>
            <div className="d-flex">
                <ProfitSVG id="avg-success-icon" className="my-auto mr-1" style={{fill: this.props.strategy.avgReturns < 0 ? "rgb(211, 63, 73)" : "green", opacity: this.props.strategy.avgReturns === "N/A" ? "40%" : "100%" }}/>
                <p className="m-0" style={{fontSize: "10pt"}}>{this.props.strategy.avgSuccess === "N/A" ? this.props.strategy.avgSuccess : Math.round(this.props.strategy.avgReturns*10)/10 + "%"}</p>
            </div>
        </div>
      </div>
    )
  }
}

export default class SavedStrategies extends Component {

  /**
   * When a strategy in the list is clicked, then bring up its information.
   * @param {Object} method - Data on the strategy clicked on.
   */
  handleStrategyClick = (method) => {
    if(this.props.selected !== method) {
      this.props.handleSelected(method);
    } else {
      this.props.handleSelected(undefined);
    }
  }

  /**
   * When a new strategy is created, generate a new strategy name in the format 'New Strategy n', where n is 1 higher than the last strategy name following this format.
   * @returns {String} - Unique strategy name.
   */
  generateNewStrategyName = () => {
    let num = undefined;
    // Use a regex to find other strategies in list with names that follow the 'New Strategy n' format.
    let re = /^New\sStrategy\s?(\d*)/;
    if(this.props.savedStrategyData !== undefined){
      for(let i=0; i<this.props.savedStrategyData.length; i++) {
        let match = re.exec(this.props.savedStrategyData[i].strategyName);
        if(match !== null) {
          if(match[1] === "" && num === undefined) {
            // If match but it doesn't have a number, then n needs to be 1.
            num = 1;
          } else if(parseInt(match[1]) === num) {
            // If match, set n 1 higher than the highest in list.
            num = parseInt(match[1]) + 1;
          }
        }
      }
    }
    // Return the unique new strategy name.
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
            this.props.savedStrategyData === undefined ? null 
            :
              this.props.savedStrategyData.length === 0 
              ?
                <div className="row col-12 mx-auto h-100 "><div className="m-auto" style={{position: "relative", bottom: "15px", fontSize: "13pt", fontWeight: "500", color:"#c2c2c2"}}>No saved strategies!</div></div>
              : 
                this.props.savedStrategyData.map((strategy, i) => <SelectionRow selected={strategy.strategyId === this.props.selected?.strategyId} availableModules={this.props.availableModules} strategy={strategy} handleStrategyClick={this.handleStrategyClick} key={i}/>)
          }
        </div>
      </div>
    );
  }
}