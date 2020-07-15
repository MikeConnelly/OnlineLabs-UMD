import React, { Component } from 'react';
import axios from 'axios';

class ControlPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleSubmit(event) {
    axios.post('/api/movement', {
      'x': this.state.x,
      'y': this.state.y
    });
    event.preventDefault();
  }

  handleUpdate(event, dimension) {
    if (dimension === 'x') {
      this.setState({
        x: parseInt(event.target.value)
      });
    } else {
      this.setState({
        y: parseInt(event.target.value)
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
              type="text"
              pattern="[0-9]*"
              value={this.state.x}
              onChange={event => this.handleUpdate(event, 'x')}
            />
          </label>
          <label>
            y position:
            <input
              type="text"
              pattern="[0-9]*"
              value={this.state.y}
              onChange={event => this.handleUpdate(event, 'y')}
            />
          </label>
          <input type="submit" value="submit" />
        </form>
      </div>
    );
  }
}

export default ControlPanel;
