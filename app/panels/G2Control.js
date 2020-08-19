import React, { Component } from 'react';
import axios from 'axios';

class G2Control extends Component {

  constructor(props) {
    super(props);
    this.state = {
      resistance: 0.0
    };
    this.setResistance = this.setResistance.bind(this);
    this.sendResistance = this.sendResistance.bind(this);
  }

  sendResistance() {
    axios.post('/g2/resistance', { resistance: this.state.resistance })
      .catch(err => {
        console.error(err);
      })
      .then(res => {
        console.log('sent');
      })
  }

  setResistance(event) {
    this.setState({ resistance: parseFloat(event.target.value) });
  }

  render() {
    return (
      <div className="photo-control">
        <form>
          <label htmlFor="resistance" id="resistance-label">Choose a resistance:</label>
          <select id="resistance" name="resistance">
            <option value="2.1" onChange={this.setResistance}>2.1</option>
            <option value="2.7" onChange={this.setResistance}>2.7</option>
            <option value="3.3" onChange={this.setResistance}>3.3</option>
            <option value="5.8" onChange={this.setResistance}>5.8</option>
            <option value="6.6" onChange={this.setResistance}>6.6</option>
            <option value="8.2" onChange={this.setResistance}>8.2</option>
            <option value="10" onChange={this.setResistance}>10</option>
            <option value="14" onChange={this.setResistance}>14</option>
            <option value="19" onChange={this.setResistance}>19</option>
            <option value="22" onChange={this.setResistance}>22</option>
            <option value="35" onChange={this.setResistance}>35</option>
            <option value="46" onChange={this.setResistance}>46</option>
            <option value="145" onChange={this.setResistance}>145</option>
            <option value="4000" onChange={this.setResistance}>4000</option>
          </select>
          <input id="resistance-submit" type="button" value="send" onClick={this.sendResistance}></input>
        </form>
      </div>
    );
  }
}

export default G2Control;
