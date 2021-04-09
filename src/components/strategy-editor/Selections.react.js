import React, { Component } from 'react';
import SelectionRow from './SelectionRow.react';
import AddModule from './AddModule.react';
import '../../css/strategy-editor/selections.css';


class Selections extends Component {
    render() {
        return (
          <div id="selections-container" className="container py-2 px-3">
            <h5 className="row col-12 strategy-editor-header">Module selection</h5>
            <div id="selection-row-container">
              <SelectionRow method="Moving Averages"/>
              <SelectionRow method="Bollinger Bands"/>
              <AddModule />
            </div>
          </div>
        )
    }
}

export default Selections;