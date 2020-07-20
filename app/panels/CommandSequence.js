import React, { Component } from 'react';

class CommandSequence extends Component {
  render() {
    const emptyList = (this.props.sequence.length === 0);
    return (
      <div className="command-sequence">
        <p id="cs-title">Previous Commands</p>
        <div className="cs-border">
          <label htmlFor="cs-checkbox">add commands on submit</label>
          <input id="cs-checkbox" name="cs-checkbox" type="checkbox" checked={this.props.autofillSequence} onChange={() => this.props.changeAutofillSequence(!this.props.autofillSequence)} />
          <div className="cs-list">
            {!emptyList ? this.props.sequence.map((point, index) => (
              <div className="cs-point" key={index}>
                <p>{`${index+1}. x: ${point.x}, y: ${point.y}`}</p>
              </div>
            )) : <p id="no-commands">no commands</p>}
          </div>
          <div className="cs-controls">
            <button id="fill-button" disabled={emptyList} onClick={this.props.fillFormWithSequence}>Fill Form</button>
            <button id="clear-button" disabled={emptyList} onClick={this.props.clearSequence}>Clear</button>
          </div>
        </div>
      </div>
    );
  }
}

export default CommandSequence;
