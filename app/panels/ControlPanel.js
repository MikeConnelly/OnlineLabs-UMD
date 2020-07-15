import React, { Component } from 'react';
import axios from 'axios';

class ControlPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      validInput: true,
      x: 0,
      y: 0
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const deltaX = parseInt(this.state.x);
    const deltaY = parseInt(this.state.y);
    if (isNaN(deltaX) || isNaN(deltaY)) {
      this.setState({ validInput: false });
    } else {
      if (!this.state.validInput) { this.setState({ validInput: true }); }
      axios.post('/api/movement', {
        'x': this.state.x,
        'y': this.state.y
      });
    }
  }

  handleUpdate(event, dimension) {
    if (dimension === 'x') {
      this.setState({
        x: event.target.value
      });
    } else {
      this.setState({
        y: event.target.value
      });
    }
  }
  
  render() {
    return (
      <div className="control-panel">
        <form onSubmit={this.handleSubmit}>
          <label>
            x position:
            <input
              type="number"
              onChange={event => this.handleUpdate(event, 'x')}
            />
          </label>
          <label>
            y position:
            <input
              type="number"
              onChange={event => this.handleUpdate(event, 'y')}
            />
          </label>
          <input type="submit" value="submit" />
        </form>
        {!this.state.validInput ? <p id="invalid-input">Invalid input</p> : <></>}
      </div>
    );
  }
}

export default ControlPanel;
