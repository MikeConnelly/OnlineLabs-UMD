import React, { Component } from 'react';
import DashboardContainer from '../DashboardContainer';
import Header from '../Header';
import Footer from '../Footer';
import G4Control from '../panels/G4Control';

export class PageG4 extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: this.props.loggedIn,
      queueState: this.props.queueState
    };
    this.setStateValues = this.setStateValues.bind(this);
  }

  setStateValues(li, qs) {
    this.props.setStateValues(li, qs, 4);
  }

  render() {
    return (
      <div className="page-g4">
        <Header
          text="Gizmo-4 - Over-The-Air Programming"
          project="g4"
          marginLeft="38%"
        />
        <DashboardContainer
          socket={this.props.socket}
          loggedIn={this.state.loggedIn}
          queueState={this.state.queueState}
          setStateValues={this.setStateValues}
          controlComponent={<G4Control />}
          project="g4"
        />
        <Footer />
      </div>
    );
  }
}

export default PageG4;
