import React, { Component } from 'react';
import axios from 'axios';

export class IdleTimer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      min: 15,
      sec: 0 
    };
    this.startTimer = this.startTimer.bind(this);
    this.getTime = this.getTime.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  componentDidMount() {
    this.startTimer();
  }

  startTimer() {
    let { min, sec } = this.state;
    sec--;
    if (sec < 0) {
      sec = 59;
      min--;
    }
    if (min < 0) {
      min = 0;
    }
    this.setState({ min, sec });
    setTimeout(this.startTimer, 1000);
  }

  getTime() {
    const { min, sec } = this.state;
    const seconds = (sec < 10) ? `0${sec}` : `${sec}`;
    return `${min}:${seconds}`;
  }

  handleRefresh(_event) {
    axios.post(`/api/${this.props.project}/refresh`, {})
      .then(() => {
        this.setState({ min: 15, sec: 0 });
      });
  }

  render() {
    const timerValue = this.getTime();
    return (
      <div className="idle-timer">
        <span id="timer">Time Remaining: {timerValue}</span>
        <button id="refresh-button" onClick={this.handleRefresh}>Refresh</button>
      </div>
    );
  }
}

export default IdleTimer;
