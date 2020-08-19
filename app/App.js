import React, { Component } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import Activity1 from './activity/Activity1';
import Activity2 from './activity/Activity2';
import Welcome from './Welcome';
import VideoContainer from './VideoContainer';
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
        <Header />
        <button onClick={this.toggleUseVNC}>
          {this.state.useVNC ? '101' : '205'}
        </button>
        {this.state.useVNC ? <Vnc /> : (
          <div>
            <div className="graph-stream">
              <GraphWrapper socket={socket} />
              <VideoContainer />
            </div>
            {/*loggedIn ? (<button onClick={this.handleLogout}>logout</button>) : <></>*/}
            <DashboardContainer
              loggedIn={loggedIn}
              setLoggedIn={this.setLoggedIn}
              socket={socket}
            />
          </div>
        )}
        <Activity1 />
        <Activity2 />
        <Footer/>
      </div>
    );
  }
}

export default App;
