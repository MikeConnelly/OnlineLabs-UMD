import React, { Component } from 'react';

class NotQueuedPanel extends Component {
  render() {
    return (
      <div className="not-queued-panel">
      <button onClick={this.props.enqueue}>Enter Queue</button>
      </div>
    );
  }
}

export default NotQueuedPanel;
