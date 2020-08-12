import React, { Component } from 'react';
import axios from 'axios';
import Header from './Header';
import DashboardContainer from './DashboardContainer';
import GraphWrapper from './GraphWrapper';
import Vnc from './panels/Vnc';
import io from 'socket.io-client';
const socket = io();

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
    };
    this.setLoggedIn = this.setLoggedIn.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.toggleUseVNC = this.toggleUseVNC.bind(this);
  }

  setLoggedIn(b) {
    this.setState({ loggedIn: b })
  }

  handleLogout() {
    axios.get('/auth/logout').then(res => this.setLoggedIn(false));
  }

  toggleUseVNC() {
    this.setState({ useVNC: !this.state.useVNC });
  }

  render() {
    const loggedIn = this.state.loggedIn;

    return (
      <div id="app-container">
        {/*loggedIn ? (<button onClick={this.handleLogout}>logout</button>) : <></>*/}
        <Header />
        <button onClick={this.toggleUseVNC}>
          {this.state.useVNC ? '101' : '205'}
        </button>
        {this.state.useVNC ? <Vnc /> : (
          <div>
            <DashboardContainer
              loggedIn={loggedIn}
              setLoggedIn={this.setLoggedIn}
              socket={socket}
            />
            <GraphWrapper socket={socket} />
          </div>
        )}
      </div>
    );
  }
}

export default App;
