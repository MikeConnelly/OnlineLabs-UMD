import React, { Component } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import Activity1 from './activity/Activity1';
import Activity2 from './activity/Activity2';
import VideoContainer from './VideoContainer';
import DashboardContainer from './DashboardContainer';
import GraphWrapper from './GraphWrapper';
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
  }

  setLoggedIn(b) {
    this.setState({ loggedIn: b })
  }

  handleLogout() {
    axios.get('/auth/logout').then(res => this.setLoggedIn(false));
  }

  render() {
    const loggedIn = this.state.loggedIn;
    return (
      <div id="app-container">
        <Header />
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
        <Activity1 />
        <Activity2 />
        <Footer/>
      </div>
    );
  }
}

export default App;
