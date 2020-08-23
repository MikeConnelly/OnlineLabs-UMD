import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import Home from './pages/Home';
import PageG1 from './pages/PageG1';
import PageG2 from './pages/PageG2';
import PageG3 from './pages/PageG3';

import io from 'socket.io-client';
const socket = io();

class App extends Component {
  render() {
    return (
      <div id="app-container">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/g1" component={props => <PageG1 socket={socket} />} />
          <Route path="/g2" component={props => <PageG2 socket={socket} />} />
          <Route path="/g3" component={props => <PageG3 socket={socket} />} />
        </Switch>
      </div>
    );
  }
}

export default App;
