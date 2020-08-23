import React, { Component } from 'react';
import axios from 'axios';
import LoginPanel from './panels/LoginPanel';
import NotQueuedPanel from './panels/NotQueuedPanel';
import QueuedPanel from './panels/QueuedPanel';

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
      },
      _mounted: true
    };
    this.getPanel = this.getPanel.bind(this);
    this.handleEnqueue = this.handleEnqueue.bind(this);
  }

  componentDidMount() {
    axios.get(`/api/${this.props.project}/info`).then(res => {
      if (this.state._mounted) {
        this.setState({ queueState: res.data.queueState });
        this.props.setLoggedIn(res.data.loggedIn);
      }
    });

    this.props.socket.on(`${this.props.project}QueueState`, data => {
      this.setState({ queueState: data });
    });
  }

  componentWillUnmount() {
    this.setState({ _mounted: false });
  }

  handleEnqueue() {
    console.log(this.props.project);
    // this.props.socket.emit('enqueue');
    axios.post(`/api/${this.props.project}/enqueue`).then(res => {
      console.log('enqueue received');
    });
  }

  /**
   * Gets panel component to display based on current state
   * @returns {Object} object with fields isControl: Boolean, comp: JSX Component
   */
  getPanel() {
    const panel = {
      isControl: false,
      comp: null
    };
    if (this.state.queueState.isCurrentUser) {
      panel.isControl = true;
      panel.comp = this.props.controlComponent;
    } else if (this.state.queueState.inQueue) {
      panel.comp = (<QueuedPanel placeInQueue={this.state.queueState.placeInQueue} />);
    } else if (this.props.loggedIn) { // logged in but haven't enqueued
      panel.comp = (<NotQueuedPanel enqueue={this.handleEnqueue} />);
    } else { // login button
      panel.comp = (<LoginPanel />);
    }
    // } else {
    //   panel.comp = (<EnterQueuePanel />);
    // }
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
              <p id="current-user-text">{`Current User: ${currentUserName}`}</p>
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
 *   when user is current user
 */
