import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

class Home extends Component {
  render() {
    return (
      <div className="home-page">
        <h1>Choose a Project:</h1>
        <Link to="/101" style={{ textDecoration: 'none' }}>
          <div id="link-101" className="link-box">
            <h2 className="link-text">ENEE 101</h2>
            <h3 className="link-text">2D Motor Controller</h3>
          </div>
        </Link>
        <Link to="/205" style={{ textDecoration: 'none' }}>
          <div id="link-205" className="link-box">
            <h2 className="link-text">ENEE 205</h2>
            <h3 className="link-text">Openscope Circuit Analysis</h3>
          </div>
        </Link>
        <Link to="/g2" style={{ textDecoration: 'none' }}>
          <div id="link-g2" className="link-box">
            <h2 className="link-text">Gizmo-2</h2>
            <h3 className="link-text">Photovoltaic Cell</h3>
          </div>
        </Link>
      </div>
    );
  }
}

export default Home;
