import React, { Component } from 'react';
import axios from 'axios';

class G2Control extends Component {

  constructor(props) {
    super(props);
    this.state = {
      resistance: 0
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
    this.setState({ resistance: parseInt(event.target.value) });
  }

  render() {
    return (
      <div className="photo-control">
        <form>
          <label for="resistance">Choose a resistance:</label>
          <select id="resistance" name="resistance">
            <option value="100" onChange={this.setResistance}>100</option>
            <option value="1000" onChange={this.setResistance}>1000</option>
            <option value="10000" onChange={this.setResistance}>10000</option>
            <option value="100000" onChange={this.setResistance}>100000</option>
          </select>
          <input type="button" value="send" onClick={this.sendResistance}></input>
        </form>
      </div>
    );
  }
}

export default G2Control;
