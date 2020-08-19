import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import Home from './pages/Home';
import Page101 from './pages/Page101';
import Page205 from './pages/Page205';
import PageG2 from './pages/PageG2';
import io from 'socket.io-client';
const socket = io();

class App extends Component {
  render() {
    return (
      <div id="app-container">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/101" component={props => <Page101 socket={socket} />} />
          <Route path="/205" component={props => <Page205 socket={socket} />} />
          <Route path="/g2" component={props => <PageG2 socket={socket} />} />
        </Switch>
      </div>
    );
  }
}

export default App;
