import React, { Component } from 'react';
import Vnc from '../panels/Vnc';
import DashboardContainer from '../DashboardContainer';
import Header from '../Header';
import Footer from '../Footer';

class PageG2 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: this.props.loggedIn,
      queueState: this.props.queueState
    };
    this.setStateValues = this.setStateValues.bind(this);
  }

  setStateValues(li, qs) {
    this.props.setStateValues(li, qs, 2);
  }

  render() {
    return (
      <div className="page-g2">
        <Header
          text="Gizmo-2 - Openscope Controller"
          project="g2"
          marginLeft="40%"
        />
        <div className = "page-g2-content">
          <DashboardContainer
            socket={this.props.socket}
            loggedIn={this.state.loggedIn}
            queueState={this.state.queueState}
            setStateValues={this.setStateValues}
            controlComponent={<Vnc />}
            project="g2"
          />
        </div>

        <Footer />
      </div>
    );
  }
}

export default PageG2;
