import React, { Component } from 'react'
import axios from 'axios';

class EnterQueuePanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: ''
    };
    this.handleEnterQueue = this.handleEnterQueue.bind(this);
    this.handleUpdateName = this.handleUpdateName.bind(this);
  }

  handleEnterQueue(_event) {
    axios.post('/auth/login', {
      username: this.state.username,
      password: this.state.username
    });
  }

  handleUpdateName(event) {
    this.setState({ username: event.target.value });
  }

  render() {
    return (
      <div className="enter-queue-panel">
        <form onSubmit={this.handleEnterQueue}>
          <input type="text" name="username" autoComplete="off" onChange={this.handleUpdateName} />
          <input type="submit" value="submit" />
        </form>
      </div>
    )
  }
}

export default EnterQueuePanel
