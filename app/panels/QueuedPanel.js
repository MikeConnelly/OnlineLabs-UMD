import React, { Component } from 'react';

class QueuedPanel extends Component {
  render() {
    return (
      <div className="queued-panel">
        {`#${this.props.placeInQueue} in the queue`}
      </div>
    );
  }
}

export default QueuedPanel;
