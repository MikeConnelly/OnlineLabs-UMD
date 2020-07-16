// Component used to replace loginPanel and NotQueuedPanel
import React, { Component } from 'react'
import axios from 'axios'

export class EnterQueuePanel extends Component {

  constructor (props) {
    super(props);
    this.state = {
      username: ''
    };
    this.handleEnterQueue = this.handleEnterQueue.bind(this);
    this.handleNameUpdate = this.handleNameUpdate.bind(this);
  }

  handleEnterQueue(event) {
    axios.post('/auth/login', {
      username: this.state.username
    });
  }

  handleNameUpdate(event) {
    this.setState({ username: event.target.value });
  }

  render() {
    return (
      <div className="enter-queue-panel">
        <form onSubmit={this.handleEnterQueue}>
          <input type="text" name="username" onChange={this.handleNameUpdate} />
          <input type="submit" value="submit" />
        </form>
      </div>
    )
  }
}

export default EnterQueuePanel
