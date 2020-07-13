import React, { Component } from 'react';
import axios from 'axios';
import DashboardContainer from './DashboardContainer';
// import TestComp from './TestComp';

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
    const { loggedIn } = this.state;

    return (
      <div id="app-container">
        <button onClick={this.handleLogout}>logout</button>
        <DashboardContainer loggedIn={loggedIn} setLoggedIn={this.setLoggedIn} />
      </div>
    );
  }
}

export default App;
