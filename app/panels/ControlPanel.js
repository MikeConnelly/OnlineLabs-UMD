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
      useJSON: false,
      jsonInput: "",
      sequence: [],
      autofillSequence: true
    };
    this.getInputForm = this.getInputForm.bind(this);
    this.handleResetPosition = this.handleResetPosition.bind(this);
    this.handleFinish = this.handleFinish.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.sendCommand = this.sendCommand.bind(this);
    this.handleAddPoint = this.handleAddPoint.bind(this);
    this.handlePointUpdate = this.handlePointUpdate.bind(this);
    this.handleRemovePoint = this.handleRemovePoint.bind(this);
    this.setUseJSON = this.setUseJSON.bind(this);
    this.handleClearSequence = this.handleClearSequence.bind(this);
    this.handleFillFormWithSequence = this.handleFillFormWithSequence.bind(this);
    this.changeAutofillSequence = this.changeAutofillSequence.bind(this);
  }

  getInputForm() {
    return (
      <div className="points">
        {this.state.points.map((point, index) => (
          <div className="point" key={index}>
            <label id="x-input-label" htmlFor="x">x axis</label>
            <input
              className="x-input"
              name="x"
              type="number"
              value={point.x}
              autoComplete="off"
              onChange={event => this.handlePointUpdate(event, 'x', index)}
            />
            <label id="y-input-label" htmlFor="y">y axis</label>
            <input
              className="y-input"
              name="y"
              type="number"
              value={point.y}
              autoComplete="off"
              onChange={event => this.handlePointUpdate(event, 'y', index)}
            />
            <input id="remove-point" type="button" onClick={event => this.handleRemovePoint(index)} value="-" />
          </div>
        ))
      }
      </div>
    );
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
      this.setState({ enableForm: true, commandSuccess: true });
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
    event.preventDefault(); // probably not needed, using input tag not button tag
    if (this.state.useJSON) {
      try {
        const input = JSON.parse(this.state.jsonInput);
        if (!Array.isArray(input)) { throw new Error('invalid input'); }

        const xArr = input.map(obj => {
          if (typeof obj === 'object' && obj !== null && obj.hasOwnProperty('x') && typeof obj.x === 'number') {
            return obj.x;
          } else { throw new Error('invalid input'); }
        });
        const yArr = input.map(obj => {
          if (typeof obj === 'object' && obj !== null && obj.hasOwnProperty('y') && typeof obj.y === 'number') {
            return obj.y;
          } else { throw new Error('invalid input'); }
        });

        if (!this.state.validInput) { this.setState({ enableForm: false, validInput: true }); }
        else { this.setState({ enableForm: false }); }
        this.sendCommand(xArr, yArr, []);
      } catch (e) {
        this.setState({ validInput: false });
      }
    } else {
      const points = JSON.parse(JSON.stringify(this.state.points)); // deep copy

      if (points.length === 0) { this.setState({ validInput: false }); }
      else {
        if (!this.state.validInput) { this.setState({ validInput: true }); }

        const xArr = points.map(p => p.x);
        const yArr = points.map(p => p.y);

        this.setState({ enableForm: false });
        this.sendCommand(xArr, yArr, points);
      }
    }
  }

  sendCommand(xArr, yArr, pointsCopy) {
    axios.post('/api/moveArray', {
      'x': xArr,
      'y': yArr
    })
    .catch(err => {
      console.log(err);
      this.setState({ enableForm: true, commandError: true });
      setTimeout(() => {
        this.setState({ commandError: false });
      }, RESPONSE_TEXT_DELAY);
    })
    .then(res => {
      if (this.state.autofillSequence && !this.state.useJSON) { this.setState({ enableForm: true, commandSuccess: true, sequence: this.state.sequence.concat(pointsCopy) }); }
      else { this.setState({ enableForm: true, commandSuccess: true }); }
      setTimeout(() => {
        this.setState({ commandSuccess: false });
      }, RESPONSE_TEXT_DELAY);
    })
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
  
  setUseJSON(event) {
    this.setState({ useJSON: event.target.checked });
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
            {!this.state.useJSON ? this.getInputForm() : (
              <div className="json-form">
                <textarea
                  id="json-input"
                  name="json-input"
                  type="textarea"
                  autoComplete="off"
                  value={this.state.jsonInput}
                  onChange={event => this.setState({ jsonInput: event.target.value })}
                />
              </div>
            )}
            <div className="button-col">
              {!this.state.useJSON ? <input id="add-point" type="button" value="+" onClick={this.handleAddPoint} /> : <></>}
              <div className="bottomRowOfControls">
                <input id="reset-position" type="button" value="Reset" disabled={!this.state.enableForm} onClick={this.handleResetPosition} />
                <input id="submit-form" type="submit" value="Submit" disabled={!this.state.enableForm} />
                <input id="finish" type="button" value="Finish" onClick={this.handleFinish} />
              </div>
            </div>
            <label id="json-cb-label" htmlFor="json-cb">use JSON format</label>
            <input id="json-cb" name="json-cb" type="checkbox" checked={this.state.useJSON} onChange={this.setUseJSON} />
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
