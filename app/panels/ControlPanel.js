import React, { Component } from 'react';
import axios from 'axios';
const defaultPoints = [ { x: 0, y: 0 } ];

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

    this.handleResetPosition = this.handleResetPosition.bind(this);
    this.handleFinish = this.handleFinish.bind(this);
  }
  
  handleResetPosition(_event) {
    axios.post('/api/reset').then(res => {
      console.log('motors reset');
    });
  }

  handleFinish(_event) {
    axios.post('/api/finish').then(res => {
      console.log('finished');
    })
  }

  handleSubmit(event) {
    event.preventDefault();
    const points = this.state.points;
    if (points.length === 0) { this.setState({ validInput: false }); }
    else if (points.length === 1) {
      if (!this.state.validInput) { this.setState({ validInput: true }); }
      axios.post('/api/movement', {
        'x': points[0].x,
        'y': points[0].y
      });
      this.setState({ 'points': defaultPoints });
    } else {
      if (!this.state.validInput) { this.setState({ validInput: true }); }
      const xArr = points.map(p => p.x);
      const yArr = points.map(p => p.y);
      axios.post('/api/moveArray', {
        'x': xArr,
        'y': yArr
      });
      this.setState({ 'points': defaultPoints });
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
        <form id="control-form" onSubmit={this.handleSubmit}>
          {this.state.points.map((point, index) => (
            <div className="point">
              <label for="x">x axis</label>
              <input
                name="x"
                type="number"
                className="control-input"
                onChange={event => this.handlePointUpdate(event, 'x', index)}
              />
              <label for="y">y axis</label>
              <input
                name="y"
                type="number"
                className="control-input"
                onChange={event => this.handlePointUpdate(event, 'y', index)}
              />
              <input id="remove-point" type="button" onClick={event => this.handleRemovePoint(index)} value="remove" />
            </div>
          ))}
          <input id="add-point" type="button" value="add point" onClick={this.handleAddPoint} />
          <input id="submit-form" type="submit" value="submit" />
        </form>
        {!this.state.validInput ? <p id="invalid-input">Invalid input</p> : <></>}
        <div id="other-controls">
          <button id="reset-position" onClick={this.handleResetPosition}>reset position</button>
          <button id="finish" onClick={this.handleFinish}>finish</button>
        </div>
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