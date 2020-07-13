import React, { Component } from 'react';

class NotQueuedPanel extends Component {
  render() {
    return(
      <div className="not-queued-panel">
        <button onClick={this.props.enqueue}>enqueue</button>
      </div>
    )
  }
}

export default NotQueuedPanel;
