import React, { Component } from 'react';
import axios from 'axios';

class G2Control extends Component {

  constructor(props) {
    super(props);
    this.state = {
      resistance: 2.1
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
    console.log(event.target.value);
    this.setState({ resistance: parseFloat(event.target.value) });
  }

  render() {
    return (
      <div className="photo-control">
        <form>
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
          <input id="resistance-submit" type="button" value="send" onClick={this.sendResistance}></input>
        </form>
      </div>
    );
  }
}

export default G2Control;
