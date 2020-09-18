import React, { Component } from 'react';
// import axios from 'axios';
import DashboardContainer from '../DashboardContainer';
import ControlPanel from '../panels/ControlPanel';
import Header from '../Header';
import Footer from '../Footer';
import Activity1 from '../activity/Activity1';
import Activity2 from '../activity/Activity2';

class PageG1 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: this.props.loggedIn,
      queueState: this.props.queueState
    };
    this.setStateValues = this.setStateValues.bind(this);
  }

  setStateValues(li, qs) {
    this.props.setStateValues(li, qs, 1);
  }

  render() {
    return (
      <div className="page-g1">
        <Header
          text="Gizmo-1 - 2D Motor Controller"
          project="g1"
          marginLeft="40%"
        />
        <DashboardContainer
          socket={this.props.socket}
          loggedIn={this.state.loggedIn}
          queueState={this.state.queueState}
          setStateValues={this.setStateValues}
          controlComponent={<ControlPanel socket={this.props.socket} />}
          project="g1"
        />
        <Activity1 />
        <Activity2 />
        <Footer />
      </div>
    );
  }
}

export default PageG1;
