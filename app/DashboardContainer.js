import React, { Component } from 'react';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
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
      },
      endpoint: ''
    };
    this.setSocketEndpoint = this.setSocketEndpoint.bind(this);
    this.getPanel = this.getPanel.bind(this);
    this.handleEnqueue = this.handleEnqueue.bind(this);
  }

  componentDidMount() {
    axios.get('/api/info').then(res => {
      this.setSocketEndpoint(res.data.mode, res.data.port);
      this.setState(res.data.queueState);
      this.props.setLoggedIn(res.data.loggedIn);
    });
  }

  setSocketEndpoint(mode, port) {
    const endpoint = (mode === 'dev') ? `http://localhost${port}` : `https://enee101online-webapp.herokuapp.com:${port}`;
    const socket = socketIOClient(endpoint);
    socket.on('QueueState', data => {
      this.setState({ queueState: data });
    });
  }

  handleEnqueue() {
    axios.post('/api/enqueue').then(res => {
      this.setState({ queueState: res.data });
    });
  }

  getPanel() {
    if (this.state.queueState.isCurrentUser) {
      return <ControlPanel />
    } else if (this.state.queueState.inQueue) {
      return <QueuedPanel />
    } else if (this.props.loggedIn) { // logged in but haven't enqueued
      return <NotQueuedPanel enqueue={this.handleEnqueue} />
    } else { // login button
      return <LoginPanel />
    }
  }

  render() {
    const { inQueue, isCurrentUser, placeInQueue, queueLength, currentUserName } = this.state.queueState;

    return (
      <div className="dashboard-container">
        <div className="queue-info">
          {`${queueLength} people in queue`}
          <br />
          {`current user: ${currentUserName}`}
        </div>
        <div className="dashboard">
          {this.getPanel()}
        </div>
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
