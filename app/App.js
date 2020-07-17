import React, { Component } from 'react';
import axios from 'axios';
import Header from './Header';
// import VideoContainer from './VideoContainer';
import DashboardContainer from './DashboardContainer';
import SensorGraph from './SensorGraph';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
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
        {loggedIn ? (<button onClick={this.handleLogout}>logout</button>) : <></>}
        <Header />
        <SensorGraph />
        <DashboardContainer loggedIn={loggedIn} setLoggedIn={this.setLoggedIn} />
      </div>
    );
  }
}

export default App;
