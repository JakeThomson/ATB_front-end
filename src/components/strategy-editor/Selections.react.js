import React, { Component } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import SelectionRow from './SelectionRow.react';
import AddModule from './AddModule.react';
import '../../css/strategy-editor/selections.css';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const SelectionList = React.memo(function SelectionList({ items, selected, handleModuleClick, handleRemoveClick }) {
  return items.map((item, index) => (
    <SelectionRow method={item} index={index} selected={item === selected} handleModuleClick={handleModuleClick} handleRemoveClick={handleRemoveClick} key={item} />
  ));
});

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: ["Moving Averages"],
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items
    });
  }

  handleModuleClick = (method) => {
    if(this.props.selected !== method) {
      this.props.handleSelected(method);
    } else {
      this.props.handleSelected(undefined);
    }
  }

  handleRemoveClick = (method) => {
    if(this.state.items.includes(method)) {
      if(this.props.selected === method) {
        this.props.handleSelected(undefined);
      }
      const items = this.state.items.filter(item => item !== method);
      this.setState({
        items
      });
    }
  }

  handleAddModuleClick = (method) => {
    if(!this.state.items.includes(method)) {
      const items = this.state.items.concat(method)
      this.setState({
        items
      })
    }
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
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
                  handleModuleClick={this.handleModuleClick} 
                  handleRemoveClick={this.handleRemoveClick} 
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <AddModule handleClick={this.handleAddModuleClick} selectedModules={this.state.items} />
        </div>
      </div>
    );
  }
}

// return (
//   <div id="selections-container" className="container py-2 px-3">
//     <h5 className="row col-12 strategy-editor-header">Module selection</h5>
//     <div id="selection-row-container">
//       <DragDropContext onDragEnd={this.onDragEnd}>
//         <Droppable droppableId="droppable">
//           {(provided, snapshot) => (
//             <div
//               {...provided.droppableProps}
//               ref={provided.innerRef}
//               style={getListStyle(snapshot.isDraggingOver)}
//             >
//               {this.state.items.map((item, index) => (
//               <Draggable key={item.id} draggableId={item.id} index={index}>
//                 {(provided, snapshot) => (
//                   <div
//                     ref={provided.innerRef}
//                     {...provided.draggableProps}
//                     {...provided.dragHandleProps}
//                     style={getItemStyle(
//                       snapshot.isDragging,
//                       provided.draggableProps.style
//                     )}
//                     >
//                       {item.content}
//                     </div>
//                   )}
//                 </Draggable>
//               ))}
//               {provided.placeholder}
//             </div>
//           )}
//         </Droppable>
//         <AddModule />
//       </DragDropContext>
//     </div>
//   </div>
// )