import React, { Component } from 'react';
import axios from 'axios';
import CommandSequence from './CommandSequence';
const RESPONSE_TEXT_DELAY = 3000;

class ControlPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      validInput: true,
      enableForm: true,
      points: [ { x: 0, y: 0 } ],
      commandSuccess: false,
      commandError: false,
      sequence: [],
      autofillSequence: true
    };
    this.handleResetPosition = this.handleResetPosition.bind(this);
    this.handleFinish = this.handleFinish.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddPoint = this.handleAddPoint.bind(this);
    this.handlePointUpdate = this.handlePointUpdate.bind(this);
    this.handleRemovePoint = this.handleRemovePoint.bind(this);
    this.handleClearSequence = this.handleClearSequence.bind(this);
    this.handleFillFormWithSequence = this.handleFillFormWithSequence.bind(this);
    this.changeAutofillSequence = this.changeAutofillSequence.bind(this);
  }
  
  handleResetPosition(_event) {
    this.setState({ enableForm: false });
    axios.post('/api/clearReset')
    .catch(err => {
      this.setState({ enableForm: true, commandError: true });
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
    const points = JSON.parse(JSON.stringify(this.state.points));
    const sequence = this.state.sequence;
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
        this.setState({ enableForm: true, commandError: true });
        setTimeout(() => {
          this.setState({ commandError: false });
        }, RESPONSE_TEXT_DELAY);
      })
      .then(res => {
        if (this.state.autofillSequence) { this.setState({ enableForm: true, commandSuccess: true, sequence: sequence.concat(points) }); }
        else { this.setState({ enableForm: true, commandSuccess: true }); }
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

  handleClearSequence(_event) {
    this.setState({ sequence: [], autofillSequence: true });
  }

  handleFillFormWithSequence(_event) {
    this.setState({ points: this.state.sequence, autofillSequence: false });
  }

  changeAutofillSequence(b) {
    this.setState({ autofillSequence: b });
  }
  
  render() {
    return (
      <div className="control-panel-wrapper">
        <div className="control-panel">
          <div className="instructions">
            <h3 id="instruction-header">Instructions:</h3>
            <ul>
              <li>Input values to control motor movement in the x and y directions</li>
              <li>Hit submit to send your command to the device</li>
              <li>The + and - buttons allow you to send multiple points at once</li>
            </ul>
          </div>
          <form id="control-form" onSubmit={this.handleSubmit}>
            {this.state.points.map((point, index) => (
              <div className="point" key={index}>
                <label id="x-input-label" htmlFor="x">x axis</label>
                <input
                  id="x-input"
                  name="x"
                  type="number"
                  value={point.x}
                  autoComplete="off"
                  className="control-input"
                  onChange={event => this.handlePointUpdate(event, 'x', index)}
                />
                <label id="y-input-label" htmlFor="y">y axis</label>
                <input
                  id="y-input"
                  name="y"
                  type="number"
                  value={point.y}
                  autoComplete="off"
                  className="control-input"
                  onChange={event => this.handlePointUpdate(event, 'y', index)}
                />
                <input id="remove-point" type="button" onClick={event => this.handleRemovePoint(index)} value="-" />
              </div>
            ))}
            <div className="button-col">
              <input id="add-point" type="button" value="+" onClick={this.handleAddPoint} />
              <div className="bottomRowOfControls">
                <input id="reset-position" type="button" value="Reset" disabled={!this.state.enableForm} onClick={this.handleResetPosition} />
                <input id="submit-form" type="submit" value="Submit" disabled={!this.state.enableForm} />
                <input id="finish" type="button" value="Finish" onClick={this.handleFinish} />
              </div>
            </div>
            {this.state.commandSuccess ? <p id="command-success">Command Sent!</p> : <></>}
            {this.state.commandError ? <p id="command-error">Error sending command</p> : <></>}
            {!this.state.validInput ? <p id="invalid-input">Invalid input</p> : <></>}
          </form>
        </div>
        <CommandSequence
          sequence={this.state.sequence}
          clearSequence={this.handleClearSequence}
          fillFormWithSequence={this.handleFillFormWithSequence}
          autofillSequence={this.state.autofillSequence}
          changeAutofillSequence={this.changeAutofillSequence}
        />
      </div>
    );
  }
}

export default ControlPanel;
