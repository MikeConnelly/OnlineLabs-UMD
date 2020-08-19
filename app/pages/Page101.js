import React, { Component } from 'react';
import axios from 'axios';
import GraphWrapper from '../GraphWrapper';
import VideoContainer from '../VideoContainer';
import DashboardContainer from '../DashboardContainer';
import ControlPanel from '../panels/ControlPanel';
import Header from '../Header';
import Footer from '../Footer';
import Activity1 from '../activity/Activity1';
import Activity2 from '../activity/Activity2';

class Page101 extends Component {

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
      <div className="101-page">
        <Header text="ENEE101 - Gizmo-1" marginLeft="43%" />
        <div className="graph-stream">
          <GraphWrapper socket={this.props.socket} />
          <VideoContainer />
        </div>
        <DashboardContainer
          socket={this.props.socket}
          loggedIn={this.state.loggedIn}
          setLoggedIn={this.setLoggedIn}
          controlComponent={<ControlPanel />}
        />
        <Activity1 />
        <Activity2 />
        <Footer />
      </div>
    );
  }
}

export default Page101;
