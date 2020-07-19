import React, { Component } from 'react';
import axios from 'axios';
const RESPONSE_TEXT_DELAY = 3000;

class ControlPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      validInput: true,
      enableForm: true,
      points: [ { x: 0, y: 0 } ],
      commandSuccess: false,
      commandError: false
    };
    this.handleResetPosition = this.handleResetPosition.bind(this);
    this.handleFinish = this.handleFinish.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddPoint = this.handleAddPoint.bind(this);
    this.handlePointUpdate = this.handlePointUpdate.bind(this);
    this.handleRemovePoint = this.handleRemovePoint.bind(this);
  }
  
  handleResetPosition(_event) {
    this.setState({ enableForm: false });
    axios.post('/api/clearReset')
    .catch(err => {
      this.setState({ enableForm: true });
      this.setState({ commandError: true });
      setTimeout(() => {
        this.setState({ commandError: false });
      }, RESPONSE_TEXT_DELAY);
    })
    .then(res => {
      this.setState({ enableForm: true });
      this.setState({ commandSuccess: true });
      setTimeout(() => {
        this.setState({ commandSuccess: false });
      }, RESPONSE_TEXT_DELAY);
    })
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
    else {
      if (!this.state.validInput) { this.setState({ validInput: true }); }
      const xArr = points.map(p => p.x);
      const yArr = points.map(p => p.y);
      this.setState({ enableForm: false });
      axios.post('/api/moveArray', {
        'x': xArr,
        'y': yArr
      })
      .catch(err => {
        console.log('error caught at /api/moveArray');
        this.setState({ enableForm: true });
        this.setState({ commandError: true });
        setTimeout(() => {
          this.setState({ commandError: false });
        }, RESPONSE_TEXT_DELAY);
      })
      .then(res => {
        this.setState({ enableForm: true });
        this.setState({ commandSuccess: true });
        setTimeout(() => {
          this.setState({ commandSuccess: false });
        }, RESPONSE_TEXT_DELAY);
      })
    }
  }

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
      <div className="control-panel-wrapper">
        <div className="control-panel">
          <form id="control-form" onSubmit={this.handleSubmit}>
            <fieldset>
              {this.state.points.map((point, index) => (
                <div className="point" key={index}>
                  <label htmlFor="x">x axis</label>
                  <input
                    id="x-input"
                    name="x"
                    type="number"
                    autoComplete="off"
                    className="control-input"
                    onChange={event => this.handlePointUpdate(event, 'x', index)}
                  />
                  <label htmlFor="y">y axis</label>
                  <input
                    id="y-input"
                    name="y"
                    type="number"
                    autoComplete="off"
                    className="control-input"
                    onChange={event => this.handlePointUpdate(event, 'y', index)}
                  />
                  <input id="remove-point" type="button" onClick={event => this.handleRemovePoint(index)} value="remove" />
                </div>
              ))}
              <input id="add-point" type="button" value="add point" onClick={this.handleAddPoint} />
              <input id="submit-form" type="submit" value="submit" disabled={!this.state.enableForm} />
            </fieldset>
          </form>
          {!this.state.validInput ? <p id="invalid-input">Invalid input</p> : <></>}
          <div id="other-controls">
            <button id="reset-position" disabled={!this.state.enableForm} onClick={this.handleResetPosition}>reset position</button>
            <button id="finish" onClick={this.handleFinish}>finish</button>
          </div>
        </div>
        {this.state.commandSuccess ? <p id="command-success">Command Sent!</p> : <></>}
        {this.state.commandError ? <p id="command-error">"Error sending command</p> : <></>}
      </div>
    );
  }
}

export default ControlPanel;
