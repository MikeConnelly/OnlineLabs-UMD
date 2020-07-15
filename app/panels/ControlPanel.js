import React, { Component } from 'react';
import axios from 'axios';

class ControlPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      validInput: true,
      points: [ { x: 0, y: 0 } ]
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.handleUpdate = this.handleUpdate.bind(this);
    this.handleAddPoint = this.handleAddPoint.bind(this);
    this.handlePointUpdate = this.handlePointUpdate.bind(this);
    this.handleRemovePoint = this.handleRemovePoint.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    if (points.length === 0) { this.setState({ validInput: false }); }
    else if (points.length === 1) {
      if (!this.state.validInput) { this.setState({ validInput: true }); }
      axios.post('/api/movement', {
        'x': this.state.points[0].x,
        'y': this.state.points[0].y
      });
    } else {
      if (!this.state.validInput) { this.setState({ validInput: true }); }
      const xArr = this.state.points.map(p => p.x);
      const yArr = this.state.points.map(p => p.y);
      axios.post('/api/moveArray', {
        'x': xArr,
        'y': yArr
      });
    }
  }

  // handleUpdate(event, dimension) {
  //   if (dimension === 'x') {
  //     this.setState({
  //       x: event.target.value
  //     });
  //   } else {
  //     this.setState({
  //       y: event.target.value
  //     });
  //   }
  // }

  handleAddPoint() {
    this.setState({ points: this.state.points.concat([{ x: 0, y: 0 }])});
  }

  handlePointUpdate(event, dimension, index) {
    const points = this.state.points;
    if (dimension === 'x') {
      points[index].x = event.target.value;
      this.setState({
        points: points
      });
    } else {
      points[index].y = event.target.value;
      this.setState({
        points: points
      });
    }
  }

  handleRemovePoint(index) {
    const points = this.state.points.filter((p, i) => i !== index);
    this.setState({ points: points });
  }
  
  render() {
    return (
      <div className="control-panel">
        <form onSubmit={this.handleSubmit}>
          {this.state.points.map((point, index) => (
            <div className="point">
              <input
                type="number"
                onChange={event => this.handlePointUpdate(event, 'x', index)}
              />
              <input
                type="number"
                onChange={event => this.handlePointUpdate(event, 'y', index)}
              />
              <button id="remove-point" onClick={event => this.handleRemovePoint(index)}>remove</button>
            </div>
          ))}
          <button id="add-point" onClick={this.handleAddPoint}>add point</button>
          <input id="submit-form" type="submit" value="submit" />
        </form>
        {!this.state.validInput ? <p id="invalid-input">Invalid input</p> : <></>}
      </div>
    );
  }
}

export default ControlPanel;

/**
 * 
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
          
 */