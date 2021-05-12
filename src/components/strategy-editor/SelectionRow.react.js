import React, { Component } from 'react';
import { Draggable } from "react-beautiful-dnd";
import {ReactComponent as RemoveSVG} from '../../images/close.svg';


class SelectionRow extends Component {

  handleModuleClick = () => {
    this.props.handleModuleClick(this.props.method);
  }

  /**
   * Remove the analysis module from the strategy on delete click. 
   * @param {Object} e - OnClick event object with data on module clicked.
   */
  handleRemoveClick = (e) => {
    e.stopPropagation();
    this.props.handleRemoveClick(this.props.method);
  }
  
  render() {
    return (
      <Draggable draggableId={this.props.method} index={this.props.index}>
        {provided => (
          <div
            onClick={this.handleModuleClick}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            id="selection-row" className={"row col-12 mx-auto" + (this.props.invalid ? " invalid" : "") + (this.props.selected ? " selected" : "")}
          >
            <h3 className="col-11 px-0 strategy-editor-header my-auto">{this.props.method}</h3>
            <div className="col-1 px-0">
              <button id="remove-btn-container" className="my-auto" onClick={this.handleRemoveClick} onMouseDown={e => e.preventDefault()}>
                <RemoveSVG id="remove-btn-icon"/>
              </button>
            </div>
          </div>
        )}
      </Draggable>
    )
  }
}

export default SelectionRow;