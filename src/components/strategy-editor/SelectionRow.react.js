import React, { Component } from 'react';


class OpenTradeList extends Component {
    render() {
        return (
          <div id="selection-row" className="row col-12 mx-auto">
            <h3 className="strategy-editor-header my-auto">{this.props.method}</h3>
          </div>
        )
    }
}

export default OpenTradeList;