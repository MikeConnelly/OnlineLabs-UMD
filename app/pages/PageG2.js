import React, { Component } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import DashboardContainer from '../DashboardContainer';
import G2Control from '../panels/G2Control';

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
      <div className="g2-page">
        <Header text="Gizmo-2 - Photovoltaic Cell" marginLeft="41%" />
        <DashboardContainer
          socket={this.props.socket}
          loggedIn={this.state.loggedIn}
          setLoggedIn={this.setLoggedIn}
          controlComponent={<G2Control />}
        />
        <Footer />
      </div>
    );
  }
}

export default PageG2;
