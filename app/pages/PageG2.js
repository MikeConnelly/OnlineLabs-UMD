import React, { Component } from 'react';
import Vnc from '../panels/Vnc';
import DashboardContainer from '../DashboardContainer';
import Header from '../Header';
import Footer from '../Footer';

class PageG2 extends Component {
  
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
      <div className="page-g2">
        <Header
          text="Gizmo-2 - Openscope Controller"
          project="g2"
          marginLeft="40%"
        />
        <DashboardContainer
          socket={this.props.socket}
          loggedIn={this.state.loggedIn}
          setLoggedIn={this.setLoggedIn}
          controlComponent={<Vnc />}
          project="g2"
        />
        <Footer />
      </div>
    );
  }
}

export default PageG2;
