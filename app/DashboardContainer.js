import React, { Component } from 'react';
import axios from 'axios';
import LoginPanel from './panels/LoginPanel';
import NotQueuedPanel from './panels/NotQueuedPanel';
import QueuedPanel from './panels/QueuedPanel';
import ControlPanel from './panels/ControlPanel';

class DashboardContainer extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      queueState: {
        inQueue: false,
        isCurrentUser: false,
        placeInQueue: 0,
        queueLength: 0,
        currentUserName: ''
      }
    };
    // this.setSocketEndpoint = this.setSocketEndpoint.bind(this);
    this.getPanel = this.getPanel.bind(this);
    this.handleEnqueue = this.handleEnqueue.bind(this);
  }

  componentDidMount() {
    axios.get('/api/info').then(res => {
      // this.setSocketEndpoint(res.data.mode, res.data.port);
      this.setState({ queueState: res.data.queueState });
      this.props.setLoggedIn(res.data.loggedIn);
    });

    this.props.socket.on('QueueState', data => {
      this.setState({ queueState: data });
    });
  }

  handleEnqueue() {
    // axios.post('/api/enqueue').then(res => {
    //   this.setState({ queueState: res.data });
    // });
    this.props.socket.emit('enqueue');
  }

  /**
   * 
   */
  getPanel() {
    const panel = {
      isControl: false,
      comp: null
    };
    if (this.state.queueState.isCurrentUser) {
      panel.isControl = true;
      panel.comp = (<ControlPanel />);
    } else if (this.state.queueState.inQueue) {
      panel.comp = (<QueuedPanel placeInQueue={this.state.queueState.placeInQueue} />);
    } else if (this.props.loggedIn) { // logged in but haven't enqueued
      panel.comp = (<NotQueuedPanel enqueue={this.handleEnqueue} />);
    } else { // login button
      panel.comp = (<LoginPanel />);
    }
    return panel;
  }

  render() {
    const { inQueue, isCurrentUser, placeInQueue, queueLength, currentUserName } = this.state.queueState;
    const personWord = (queueLength === 1) ? 'person' : 'people';
    const { isControl, comp } = this.getPanel();
    // for design testing
    // const isControl = true;
    // const comp = (<ControlPanel />);

    return (
      <div>
        {!isControl ? (
          <div className="dashboard-container">
            <div className="queue-info">
              <p id="queue-length-text">{`${queueLength} ${personWord} in the queue`}</p>
              <p id="current-user-text">{`current user: ${currentUserName}`}</p>
            </div>
            <div className="dashboard">
              {comp}
            </div>
          </div>
        ) : comp}
      </div>
    );
  }
}

export default DashboardContainer;

/**
 * 4 dashboard screens
 * always show total in queue and current user
 * 
 * nothing but login button:
 *   whenever user is not logged in
 * 
 * enqueue button
 *   when user is queued - isCurrentUser should be false
 * 
 * waiting in queue
 *   show place in queue
 * 
 * controls
 *   when user is current uesr
 */

// this should be brought down to 3 screens when login and enqueue
// are combined and we use local authentication
