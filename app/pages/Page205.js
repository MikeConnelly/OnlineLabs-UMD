import React, { Component } from 'react';
import Vnc from '../panels/Vnc';
import DashboardContainer from '../DashboardContainer';
import Header from '../Header';
import Footer from '../Footer';

class Page205 extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    };
    this.setLoggedIn = this.setLoggedIn.bind(this);
  }
  
  setLoggedIn(b) {
    this.setState({ loggedIn: b });
  }

  render() {
    return (
      <div className="205-page">
        <Header text="ENEE205 - Openscope Controller" marginLeft="40%" />
        <DashboardContainer
          socket={this.props.socket}
          loggedIn={this.state.loggedIn}
          setLoggedIn={this.setLoggedIn}
          controlComponent={<Vnc />}
        />
        <Footer />
      </div>
    );
  }
}

export default Page205;
