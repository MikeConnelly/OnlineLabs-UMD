import React, { Component } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import DashboardContainer from '../DashboardContainer';
import VideoContainer from '../VideoContainer';
import G3Control from '../panels/G3Control';

class PageG3 extends Component {
  
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
      <div className="page-g3">
        <Header
          text="Gizmo-3 - Photovoltaic Cell"
          project="g3"
          marginLeft="41%"
        />
        <VideoContainer url="http://129.2.94.100:6092/stream" />
        <DashboardContainer
          socket={this.props.socket}
          loggedIn={this.state.loggedIn}
          setLoggedIn={this.setLoggedIn}
          controlComponent={<G3Control socket={this.props.socket} />}
          project="g3"
        />
        <Footer />
      </div>
    );
  }
}

export default PageG3;
