import React, { Component } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import LoginPanel from './panels/LoginPanel';
import NotQueuedPanel from './panels/NotQueuedPanel';
import QueuedPanel from './panels/QueuedPanel';
import ControlPanel from './panels/ControlPanel';
const socket = io();

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

    socket.on('QueueState', data => {
      this.setState({ queueState: data });
    });
  }

  // componentDidUpdate() {
  //   if (this.state.endpoint) {
  //     var socket = io(this.state.endpoint);
  //     socket.on('QueueState', data => {
  //       this.setState({ queueState: data });
  //     });
  //   }
  // }

  // setSocketEndpoint(mode, port) {
  //   const url = (mode === 'dev') ? `http://localhost:${port}` : `https://enee101online-webapp.herokuapp.com:${port}`;
  //   this.setState({ endpoint: url });
  // }

  handleEnqueue() {
    // axios.post('/api/enqueue').then(res => {
    //   this.setState({ queueState: res.data });
    // });
    socket.emit('enqueue');
  }

  getPanel() {
    if (this.state.queueState.isCurrentUser) {
      return <ControlPanel />
    } else if (this.state.queueState.inQueue) {
      return <QueuedPanel placeInQueue={this.state.queueState.placeInQueue} />
    } else if (this.props.loggedIn) { // logged in but haven't enqueued
      return <NotQueuedPanel enqueue={this.handleEnqueue} />
    } else { // login button
      return <LoginPanel />
    }
  }

  render() {
    const { inQueue, isCurrentUser, placeInQueue, queueLength, currentUserName } = this.state.queueState;
    const personWord = (queueLength === 1) ? 'person' : 'people';
    // console.log(`socket info update: ${JSON.stringify(this.state.queueState)}`);

    return (
      <div className="dashboard-container">
        <div className="queue-info">
          {!isCurrentUser ? (
            <div>
              <p id="queue-length-text">{`${queueLength} ${personWord} in the queue`}</p>
              <p id="current-user-text">{`current user: ${currentUserName}`}</p>
            </div>
          ) : (
            <p id="is-current-user">You are in control!</p>
          )}
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
