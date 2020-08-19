import React, { Component } from 'react';

class Activity2 extends Component {
  render() {
    return (
      <div className="activity-wrapper">
        <div className="activity">
          <div className="head">
            <h3>ACTIVITY #2</h3>
            <div>
              <div className="activity2">
                <div className="column-left">
                  <h3 id="instruction-header">INSTRUCTIONS</h3>
                  <div className="instructions-Act2">
                    <ul>
                      <li>Enter a JSON Object and any desired shape by using the format explained below</li>
                      <li>First we’ll create an array (single row table) by declaring all coordinates between “[ ]”</li>
                      <li>Each “x” and “y” coordinate is mapped to its  integer value. For example “x” : 10 </li>
                      <li>All coordinate pairs are wrapped in curly braces and are seperated by commas</li>
                      <li>For example an 8-step “M” pattern:</li>
                    </ul>
                  </div>
                </div>
                <div className="column-center">
                  <h3 id="instruction-header">JSON</h3>
                  <p>Enter JSON: </p>
                  <div className="json-form">
                    <textarea
                      id="json-input"
                      name="json-input"
                      type="textarea"
                      autoComplete="off"
                    />
                  </div>
                  <input id="submit-form" type="submit" value="Submit"/>
                </div>
                <div className="column-right">
                  <h3 id="instruction-header">RESULTS</h3>
                  <p>Describe the pattern you generated and 
                      the approximate range in the X and Y axis:</p>
                  <div className="act2-results">
                    <textarea
                      id="results-input"
                      name="results-input"
                      type="textarea"
                      autoComplete="off"
                    />
                  </div>
                  <input id="submit-form" type="submit" value="Submit"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Activity2;
