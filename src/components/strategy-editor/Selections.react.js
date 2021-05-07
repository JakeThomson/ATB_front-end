import React, { Component } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import SelectionRow from './SelectionRow.react';
import AddModule from './AddModule.react';
import '../../css/strategy-editor/selections.css';

/* This component features code fragments from the react-beautiful-dnd examples and samples at:
   https://react-beautiful-dnd.netlify.app/?path=/story/single-vertical-list--basic */

/**
 * Reorder the selected modules around when dragging component.
 */
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Component holding all selected analysis modules.
 */
const SelectionList = React.memo(function SelectionList({ items, selected, handleModuleClick, handleRemoveClick, options }) {
  function isValid(item) {
    if(options.length === 0) {
      return true;
    }
    if(!options.includes(item)) {
      return false;
    }
    return true;
  }
  return items.map((item, index) => (
    <SelectionRow method={item} index={index} invalid={!isValid(item)} selected={item === selected} handleModuleClick={handleModuleClick} handleRemoveClick={handleRemoveClick} key={item} />
  ));
});

export default class Selections extends Component {
  constructor(props) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.state = {
      items: []
    }
  }

  /**
   * When an analysis module is added/removed, update the list of selected modules.
   */
  componentDidUpdate(prevProps) {
    if (prevProps.strategyData !== this.props.strategyData) {
      let items = this.props.strategyData.map(a => a.name);
      this.setState({items});
    }
  }

  /**
   * When dropping analysis module.
   */
  onDragEnd(result) {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.props.handleModuleReorder(
      result.source.index,
      result.destination.index
    );

    this.setState({
      items
    });
  }

  /**
   * When a module in the list is clicked, then bring up its config options.
   * @param {Object} method - Data on the module clicked on.
   */
  handleModuleClick = (method) => {
    if(this.props.selected !== method) {
      this.props.handleSelected(method);
    } else {
      // Unfocus on second click.
      this.props.handleSelected(undefined);
    }
  }

  /**
   * Remove the analysis module from the strategy on delete click. 
   * @param {Object} method - Data on the module to be removed.
   */
  handleRemoveClick = (method) => {
    if(this.state.items.includes(method)) {
      if(this.props.selected === method) {
        this.props.handleSelected(undefined);
      }
      const items = this.state.items.filter(item => item !== method);
      this.setState({
        items
      });
      this.props.handleRemoveModuleClick(method);
    }
  }

  /**
   * Add the analysis module to the strategy.
   * @param {Object} method - Data on the module to be removed.
   */
  handleAddModuleClick = (method) => {
    if(!this.state.items.includes(method)) {
      const items = this.state.items.concat(method)
      this.setState({
        items
      })
      this.props.handleAddModuleClick(method);
    }
  }

  render() {
    return (
      <div id="selections-container" className="container py-2 px-3">
        <h5 className="row col-12 strategy-editor-header">Module selection</h5>
        <div id="selection-row-container">
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="list" >
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <SelectionList 
                  items={this.state.items} 
                  selected={this.props.selected} 
                  options={this.props.options}
                  handleModuleClick={this.handleModuleClick} 
                  handleRemoveClick={this.handleRemoveClick} 
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <AddModule handleClick={this.handleAddModuleClick} selectedModules={this.state.items} options={this.props.options} />
        </div>
      </div>
    );
  }
}