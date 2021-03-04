import React, { Component } from 'react';
import '../css/world-flow.css';

class WorldFlow extends Component {
    render() {
        return (
            <div id="date-container">
                <svg id={this.props.playpause} className="playPause" enable-background="new 0 0 511.448 511.448" viewBox="0 0 511.448 511.448" xmlns="http://www.w3.org/2000/svg"><path d="m436.507 74.94c-99.913-99.913-261.64-99.927-361.567 0-99.913 99.913-99.927 261.64 0 361.567 99.913 99.913 261.639 99.928 361.567 0 99.914-99.911 99.93-261.639 0-361.567zm-189.224 197.361-96 74.667c-13.642 10.609-33.893.986-33.893-16.577v-149.333c0-17.441 20.117-27.29 33.893-16.577l96 74.667c10.809 8.407 10.795 24.756 0 33.153zm82.774 58.09c0 11.598-9.402 21-21 21s-21-9.402-21-21v-149.333c0-11.598 9.402-21 21-21s21 9.402 21 21zm74.667 0c0 11.598-9.402 21-21 21s-21-9.402-21-21v-149.333c0-11.598 9.402-21 21-21s21 9.402 21 21z"/></svg>
                <p id="date">{this.props.date}</p>
            </div>
        )
      }
}

export default WorldFlow;