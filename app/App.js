import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import Home from './pages/Home';
import PageG1 from './pages/PageG1';
import PageG2 from './pages/PageG2';
import PageG3 from './pages/PageG3';
import PageG4 from './pages/PageG4';
import io from 'socket.io-client';
import axios from 'axios';
const socket = io();
const defaultState = {
  inQueue: false,
  isCurrentUser: false,
  placeInQueue: 0,
  queueLength: 0,
  currentUserName: ''
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      queueState1: defaultState,
      queueState2: defaultState,
      queueState3: defaultState,
      queueState4: defaultState
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.setStateValues = this.setStateValues.bind(this);
  }

  componentDidMount() {
    axios.get('/api/allinfo')
      .catch(err => {
        console.error(err);
      })
      .then(res => {
        this.setState(res.data);
      });
  }

  handleLogout() {
    axios.get('/auth/logout').then(res => this.setState({ loggedIn: false }));
  }

  statesEqual(s1, s2) {
    return (
      s1.inQueue === s2.inQueue &&
      s1.isCurrentUser === s2.isCurrentUser &&
      s1.placeInQueue === s2.placeInQueue &&
      s1.queueLength === s2.queueLength &&
      s1.currentUserName === s2.currentUserName
    );
  }

  setStateValues(li, qs, project) {
    if (project === 1) {
      if (this.state.loggedIn !== li || !this.statesEqual(this.state.queueState1, qs)) { this.setState({ loggedIn: li, queueState1: qs }); }
    } else if (project === 2) {
      if (this.state.loggedIn !== li || !this.statesEqual(this.state.queueState2, qs)) { this.setState({ loggedIn: li, queueState2: qs }); }
    } else if (project === 3) {
      if (this.state.loggedIn !== li || !this.statesEqual(this.state.queueState3, qs)) { this.setState({ loggedIn: li, queueState3: qs }); }
    } else {
      if (this.state.loggedIn !== li || !this.statesEqual(this.state.queueState4, qs)) { this.setState({ loggedIn: li, queueState4: qs }); }
    }
  }

  render() {
    const { loggedIn, queueState1, queueState2, queueState3, queueState4 } = this.state;
    return (
      <div id="app-container">
        <Switch>
          <Route exact path="/" component={props => <Home loggedIn={loggedIn} handleLogout={this.handleLogout} />} />
          <Route path="/g1" component={props => <PageG1 socket={socket} setStateValues={this.setStateValues} loggedIn={this.state.loggedIn} queueState={queueState1} />} />
          <Route path="/g2" component={props => <PageG2 socket={socket} setStateValues={this.setStateValues} loggedIn={this.state.loggedIn} queueState={queueState2} />} />
          <Route path="/g3" component={props => <PageG3 socket={socket} setStateValues={this.setStateValues} loggedIn={this.state.loggedIn} queueState={queueState3} />} />
          <Route path="/g4" component={props => <PageG4 socket={socket} setStateValues={this.setStateValues} loggedIn={this.state.loggedIn} queueState={queueState4} />} />
        </Switch>
      </div>
    );
  }
}

export default App;
