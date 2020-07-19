import React, { Component } from 'react';
import Logo from '../public/img/circle-logo.jpg';

class Header extends Component {
  render() {
    return (
      <div className="header">
        <img id="header-img" src={Logo} alt="logo" width="75" height="75" />
        <div className="inner-header">
          <h3 className="header-text">ENEE 101 Motor Controller</h3>
          <div className="underline"></div>
        </div>
      </div>
    );
  }
}

export default Header;
