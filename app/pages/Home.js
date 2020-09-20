import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LoginPanel from '../panels/LoginPanel';
import './Home.css';

class Home extends Component {
  render() {
    const { loggedIn } = this.props;
    return (
      <div className="home-page">
        {loggedIn ? <></> : <LoginPanel />}
        <h1>Choose a Project:</h1>
        <Link to="/g1" style={{ textDecoration: 'none' }}>
          <div id="link-g1" className="link-box">
            <h2 className="link-text">Gizmo-1</h2>
            <h3 className="link-text">2D Motor Controller</h3>
          </div>
        </Link>
        <Link to="/g2" style={{ textDecoration: 'none' }}>
          <div id="link-g2" className="link-box">
            <h2 className="link-text">Gizmo-2</h2>
            <h3 className="link-text">Op-Amp Negative Feedback Circuits</h3>
          </div>
        </Link>
        <Link to="/g3" style={{ textDecoration: 'none' }}>
          <div id="link-g3" className="link-box">
            <h2 className="link-text">Gizmo-3</h2>
            <h3 className="link-text">Photovoltaic Cell</h3>
          </div>
        </Link>
        <Link to="/g4" style={{ textDecoration: 'none' }}>
          <div id="link-g4" className="link-box">
            <h2 className="link-text">Gizmo-4</h2>
            <h3 className="link-text">Over-The-Air Programming</h3>
          </div>
        </Link>
        {loggedIn ? (
          <div className="logout">
            <button id="logout-button" onClick={this.props.handleLogout}>
              <span className="buttonText">Logout</span>
            </button>
          </div>
        ) : <></>}
      </div>
    );
  }
}

export default Home;
