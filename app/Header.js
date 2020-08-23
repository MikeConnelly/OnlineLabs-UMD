import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Logo from '../public/img/circle-logo.jpg';
import './Header.css';

class Header extends Component {

  constructor(props) {
    super(props);
    this.homeDisconnect = this.homeDisconnect.bind(this);
  }

  componentDidMount() {
    const self = this;

    window.onpopstate = () => {
      self.homeDisconnect();
    }

    window.addEventListener('beforeunload', event => {
      axios.post(`/api/${self.props.project}/returnhome`);
    });
  }

  componentWillUnmount() {
    window.onpopstate = () => {};
  }

  homeDisconnect() {
    axios.post(`/api/${this.props.project}/returnhome`);
  }

  render() {
    const { text, marginLeft } = this.props;

    return (
      <div className="header">
        <img id="header-img" src={Logo} alt="logo" width="75" height="75" />
        <div className="inner-header">
          <div>
            <Link to="/" onClick={this.homeDisconnect}>
              <h3 className="link-home">Back To Home</h3>
            </Link>
            <h3 className="header-text" style={{ marginLeft: marginLeft }}>{text}</h3>
          </div>
          <div className="underline"></div>
        </div>
      </div>
    );
  }
}

export default Header;
