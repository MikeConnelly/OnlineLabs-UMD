import React, { Component } from 'react';
import Logo from '../public/img/logo.png';

class Header extends Component {
  render() {
    return (
      <div className="header">
        <img src={Logo} alt="logo" width="300" height="75" />
      </div>
    );
  }
}

export default Header;
