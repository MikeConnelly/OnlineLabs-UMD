import React, { Component } from 'react';
import axios from 'axios';
import './G3Control.css';

class G3Control extends Component {

  constructor(props) {
    super(props);
    this.state = {
      resistance: 2.1,
      currVoltage: 0.0,
      sliderVal: "0"
    };
    this.setResistance = this.setResistance.bind(this);
    this.setSliderVal = this.setSliderVal.bind(this);
    this.sendValues = this.sendValues.bind(this);
  }

  componentDidMount() {
    this.props.socket.on('g3SensorData', data => {
      console.log(JSON.stringify(data));
      this.setState({ currVoltage: parseFloat(data.iotData) });
    });
  }

  setResistance(event) {
    this.setState({ resistance: parseFloat(event.target.value) });
  }

  setSliderVal(event) {
    this.setState({ sliderVal: `${event.target.value}` });
  }

  sendValues() {
    axios.post('/g3/data', {
      brightness: parseInt(this.state.sliderVal),
      resistance: this.state.resistance
    }).catch(err => {
      console.error(err);
    })
  }

  render() {
    return (
      <div className="g3-control">
        <form className="g3-form">
          <label htmlFor="resistance" id="resistance-label">Choose a resistance:</label>
          <select id="resistance" name="resistance" onChange={this.setResistance}>
            <option value="2.1">2.1</option>
            <option value="2.7">2.7</option>
            <option value="3.3">3.3</option>
            <option value="5.8">5.8</option>
            <option value="6.6">6.6</option>
            <option value="8.2">8.2</option>
            <option value="10">10</option>
            <option value="14">14</option>
            <option value="19">19</option>
            <option value="22">22</option>
            <option value="35">35</option>
            <option value="46">46</option>
            <option value="145">145</option>
            <option value="4000">4000</option>
          </select>
          <div className="slide-container">
            <label htmlFor="brightness">Brightness: {this.state.sliderVal}</label>
            <input
              id="brightness-slider"
              type="range"
              min="0" max="255"
              name="brightness"
              onInput={this.setSliderVal}
              style={{
                width: '100%'
              }}
            />
          </div>
          <input
            type="button"
            value="set values"
            onClick={this.sendValues}
            style={{
              width: '100%'
            }}
          />
        </form>
        <div className="voltage-display">
          <p>Voltage: {this.state.currVoltage}</p>
        </div>
      </div>
    );
  }
}

export default G3Control;
