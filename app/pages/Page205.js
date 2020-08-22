import React, { Component } from 'react';
import Vnc from '../panels/Vnc';
import DashboardContainer from '../DashboardContainer';
import VideoContainer from '../VideoContainer';
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
      <div className="page-205">
        <Header text="ENEE205 - Openscope Controller" marginLeft="40%" />
        <DashboardContainer
          socket={this.props.socket}
          loggedIn={this.state.loggedIn}
          setLoggedIn={this.setLoggedIn}
          controlComponent={<Vnc />}
        />
        <VideoContainer url="http://129.2.94.100:6081/stream" />
        <Footer />
      </div>
    );
  }
}

export default Page205;
