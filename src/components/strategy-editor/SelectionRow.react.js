import React, { Component } from 'react';
import { Draggable } from "react-beautiful-dnd";


class OpenTradeList extends Component {

  handleClick = () => {
    this.props.handleClick(this.props.method);
  }
  
  render() {
    return (
      <Draggable draggableId={this.props.method} index={this.props.index}>
        {provided => (
          <div
            onClick={this.handleClick}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            id="selection-row" className={"row col-12 mx-auto" + (this.props.selected ? " selected" : "")}>
            <h3 className="strategy-editor-header my-auto">{this.props.method}</h3>
          </div>
        )}
      </Draggable>
    )
  }
}

export default OpenTradeList;